import {
  AccessBankDetails,
  AccountLoginDetails,
  App,
  CustomerAccount,
  MAIL_SERVICE,
  RmqService,
} from '@app/common';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLoginDto, AccessQueryDto } from '../dto/access.dto';
import * as path from 'path';
import * as fs from 'fs';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { genAccountCredentialsToSave } from '../functions';
import { AccessLoginApi } from '../api/access-login.api';
import { parseStringPromise } from 'xml2js';
import { accessAccountDetailsApi } from '../api/access-account.api';
import { generateHexValue, sendNewAccountInfo } from '@app/common/utils/banks';
import { GenerateAccessStatement } from './generate-statement';
import { ClientProxy, RmqContext } from '@nestjs/microservices';

@Injectable()
export class AccessLoginService {
  private readonly logger = new Logger(AccessLoginService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    private readonly generateAccountStatement: GenerateAccessStatement,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
    @InjectRepository(AccessBankDetails)
    private readonly accessRepo: Repository<AccessBankDetails>,
    private readonly rmqService: RmqService,
  ) {}

  async execute(query: AccessQueryDto, data: AccessLoginDto, context: RmqContext) {
    const { account_no, user_reference } = query;

    try {
      if (account_no) {
        const { device_id } = query;
        const filePath = path.join(__dirname, `../../public/account/access_${device_id}.json`);
        const readSavedFile = fs.readFileSync(filePath, 'utf8');
        const readableVersion = await JSON.parse(readSavedFile);
        const accountIndex =
          readableVersion.accessDetailsParsedString.response.collection[0].model.findIndex(
            (account: any) => account.accountno[0] === account_no,
          );
        const check = await this.checkForDuplicateAccountService.execute({
          account_no:
            readableVersion.accessDetailsParsedString.response.collection[0].model[accountIndex]
              .accountno[0],
          business_id: readableVersion.business_id,
          public_key: readableVersion.public_key,
        });
        if (check) {
          throw new BadRequestException('Account has been linked');
        }
        const accountCredentialsToSave = await genAccountCredentialsToSave(
          readableVersion.accessDetailsParsedString,
          accountIndex,
          readableVersion.username,
          readableVersion.userpassphrase,
          readableVersion.public_key,
          readableVersion.business_id,
          readableVersion.userReference,
          readableVersion.BwInstance,
          readableVersion.csrfToken,
          readableVersion.sessionID,
        );
        fs.unlink(filePath, (err) => {
          this.logger.error(`Error deleting Access file ${filePath}`);
        });
        const account = await this.accountRepo.save(accountCredentialsToSave.account_details);
        accountCredentialsToSave.access_details.account_id = account.id;
        accountCredentialsToSave.login_details.account_id = account.id;
        const a = await this.accessRepo.save(accountCredentialsToSave.access_details);
        const c = await this.bankLoginRepo.save(accountCredentialsToSave.login_details);
        await this.generateAccountStatement.execute(account, context);
        return await this.preparedAccessAccountResponse(account);
      }
      const { username, userpassphrase, public_key, business_id } = data;
      const response = await AccessLoginApi(username, userpassphrase);

      const parsedString = await parseStringPromise(response.data);
      if (parsedString.error) {
        throw new BadRequestException(parsedString.error.message[0]);
      }

      const headerItems = response.headers['set-cookie'];
      const sessionID = headerItems![0].split(';')[0].split('=')[1];
      const BwInstance = headerItems![2].split(';')[0].split('=')[1];
      const csrfToken = parsedString.success.csrftoken[0];
      const accessDetailsParams = new URLSearchParams();
      accessDetailsParams.append(csrfToken.split('=')[0], csrfToken.split('=')[1]);
      const accessDetailsParsedString = await accessAccountDetailsApi(
        BwInstance,
        sessionID,
        accessDetailsParams,
      );
      console.log(accessDetailsParsedString);
      if (accessDetailsParsedString.response.collection[0].model.length > 1) {
        const device_id = generateHexValue();
        const readableDirectory = path.join(__dirname, '../../public/account');
        if (!fs.existsSync(readableDirectory)) {
          fs.mkdirSync(readableDirectory);
        }
        const filePath = path.join(__dirname, `../../public/account/access_${device_id}.json`);
        fs.writeFileSync(
          filePath,
          JSON.stringify({
            accessDetailsParsedString,
            public_key,
            business_id,
            user_reference,
            BwInstance,
            csrfToken,
            username,
            userpassphrase,
            sessionID,
          }),
        );
        const whatToSendForUserToConfirm = [];
        for (const currentIndex in accessDetailsParsedString.response.collection[0].model) {
          const currentAccount =
            accessDetailsParsedString.response.collection[0].model[currentIndex];
          whatToSendForUserToConfirm.push({
            fullName: currentAccount.name[0],
            accountNumber: currentAccount.accountno[0],
            balance: `${currentAccount.currency[0]} ${currentAccount.balance_home_raw[0]}`,
          });
        }
        return {
          message: 'select account',
          data: { device_id, whatToSendForUserToConfirm },
        };
      }
      const check = await this.checkForDuplicateAccountService.execute({
        account_no: accessDetailsParsedString.response.collection[0].model[0].accountno[0],
        business_id,
        public_key,
      });
      if (check) {
        throw new BadRequestException('Account has been linked');
      }
      const credentialsToSave = genAccountCredentialsToSave(
        accessDetailsParsedString,
        0,
        username,
        userpassphrase,
        public_key,
        business_id,
        BwInstance,
        user_reference,
        csrfToken,
        sessionID,
      );
      const account: any = await this.accountRepo.save(credentialsToSave.account_details);
      credentialsToSave.access_details.account_id = account.id;
      credentialsToSave.login_details.account_id = account.id;
      await this.accessRepo.save(credentialsToSave.access_details);
      await this.bankLoginRepo.save(credentialsToSave.login_details);
      await this.generateAccountStatement.execute(account, context);
      sendNewAccountInfo({ appRepo: this.appRepo, account, mailClient: this.mailClient });
      return this.preparedAccessAccountResponse(account);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  private preparedAccessAccountResponse(newCustomer: CustomerAccount) {
    return {
      account: {
        id: newCustomer.id,
        institution: {
          name: newCustomer.bank_name,
          bankCode: newCustomer.bank_code,
          type: newCustomer.account_type,
        },
        name: newCustomer.full_name,
        accountNumber: newCustomer.account_no,
        balance: newCustomer.balance,
        currency: newCustomer.currency,
        user_reeference: newCustomer.user_reference,
        bvn: newCustomer.bvn.substring(0, 4),
      },
    };
  }
}
