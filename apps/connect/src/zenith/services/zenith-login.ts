import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE } from '@app/common';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZenithLoginDto, ZenithQueryDto } from '../dto/zenith.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { generateAccountToSave } from '../functions';
import { GenerateZenithStatementService } from './zenith-generate-statement';
import { generateHexValue, sendNewAccountInfo } from '@app/common/utils/banks';
import { ZenithAuthService } from './zenith-auth';
import { ClientProxy } from '@nestjs/microservices';

export class ZenithLoginService {
  private readonly logger = new Logger(ZenithLoginService.name);
  constructor(
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    private readonly generateZenithStatementService: GenerateZenithStatementService,
    private readonly zenithAuthService: ZenithAuthService,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
  ) {}

  async execute(query: ZenithQueryDto, data: ZenithLoginDto) {
    const { account_no } = query;

    try {
      if (account_no) {
        const { device_id } = query;
        const filePath = path.join(__dirname, `../../public/account/zenith_${device_id}.json`);
        const readSavedFile = fs.readFileSync(filePath, 'utf8');
        const readableVersion = await JSON.parse(readSavedFile);

        const accountIndex = readableVersion.accounts.findIndex(
          (account: any) => account.accountNumber === account_no,
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

        const credetialsTosave = generateAccountToSave(
          readableVersion,
          accountIndex,
          readableVersion.deviceId,
          readableVersion.loginID,
          readableVersion.password,
          readableVersion.publicKey,
          readableVersion.orgId,
          readableVersion.userReference,
        );

        const account = await this.accountRepo.save(credetialsTosave.account_details);
        await this.bankLoginRepo.save(credetialsTosave.loginDetails);

        const { password } = data;

        await this.generateZenithStatementService.execute(account, password);

        fs.unlink(filePath, (err: any) => {
          if (err)
            this.logger.error(
              `Error removing zenith multiple account file. Caused by:${err?.cause} -- Message:${err?.message}`,
            );
        });
        sendNewAccountInfo({ appRepo: this.appRepo, account, mailClient: this.mailClient });

        return this.preparedZenithccountResponse(account);
      }
      const { login_id, password, public_key, business_id } = data;

      const app = await this.appRepo.findOne({ where: { public_key } });

      const device_id = generateHexValue();

      const user_reference: any = query || generateHexValue(32);

      const readableVersion = await this.zenithAuthService.execute(
        login_id,
        password,
        device_id,
        business_id,
        app?.private_key!,
        'Api',
      );

      if (readableVersion.accounts.length > 1) {
        const readableDirectory = path.join(__dirname, '../../public/account');
        if (!fs.existsSync(readableDirectory)) {
          fs.mkdirSync(readableDirectory);
        }

        const filePath = path.join(__dirname, `../../public/account/zenith_${device_id}.json`);
        fs.writeFileSync(
          filePath,
          JSON.stringify({
            readableVersion,
            device_id,
            login_id,
            public_key,
            password,
            business_id,
            user_reference,
          }),
        );

        const whatToSendForUserToConfirm = [];
        for (const currentIndex in readableVersion.accounts) {
          const currentAccount = readableVersion.accounts[currentIndex];
          whatToSendForUserToConfirm.push({
            fullName: currentAccount.accountName,
            accountNumber: currentAccount.accountNumber,
            balance: currentAccount.availableBalance,
          });
        }
        return {
          message: 'select account',
          data: { device_id, whatToSendForUserToConfirm },
        };
      }
      const check = await this.checkForDuplicateAccountService.execute({
        account_no: readableVersion.accounts[0].accountNumber,
        business_id,
        public_key,
      });

      if (check) {
        throw new BadRequestException('Account has been linked');
      }

      const credetialsTosave = generateAccountToSave(
        readableVersion,
        0,
        device_id,
        login_id,
        password,
        public_key,
        business_id,
        user_reference,
      );
      const account = await this.accountRepo.save(credetialsTosave.account_details);
      await this.bankLoginRepo.save(credetialsTosave.loginDetails);
      await this.generateZenithStatementService.execute(account, password);
      sendNewAccountInfo({ appRepo: this.appRepo, account, mailClient: this.mailClient });

      return this.preparedZenithccountResponse(account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private preparedZenithccountResponse(newCustomer: CustomerAccount) {
    return {
      account: {
        id: newCustomer.id,
        institution: {
          name: newCustomer.bank_name,
          bank_code: newCustomer.bank_code,
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
