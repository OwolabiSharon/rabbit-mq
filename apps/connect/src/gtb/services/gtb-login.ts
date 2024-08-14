import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqService } from '@app/common';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GtbLoginDto, GtbQueryDto } from '../dto/gtb.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { GenerateGtbTransactionService } from './gtb-generate-transaction';
import { GtAuth } from '../api/gtb-auth.api';
import { genCustomerCredentialsToSave } from '../functions';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { sendNewAccountInfo } from '@app/common/utils/banks';

export class GtbLoginService {
  private readonly logger = new Logger(GtbLoginService.name);

  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    private readonly generateGtbTransaction: GenerateGtbTransactionService,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
    private readonly rmqService: RmqService,
  ) {}

  async execute(query: GtbQueryDto, data: GtbLoginDto, context: RmqContext) {
    const { account_no, user_reference } = query;
    try {
      if (account_no) {
        const { device_id } = query;
        const filePath = path.join(__dirname, `../../public/account/gt_${device_id}.json`);
        const readSavedFile = fs.readFileSync(filePath, 'utf8');
        const readableVersion = await JSON.parse(readSavedFile);

        const accountIndex: number = readableVersion.parsedResponse.ACCOUNTS.ACCOUNT.findIndex(
          (account: any) => account.NUMBER === account_no,
        );

        const check = await this.checkForDuplicateAccountService.execute({
          account_no: readableVersion.parsedResponse.ACCOUNTS.ACCOUNT[accountIndex].NUMBER,
          business_id: readableVersion.orgId,
          public_key: readableVersion.publicKey,
        });

        if (check) {
          throw new BadRequestException('Account has been linked');
        }

        const credentialsToSave = genCustomerCredentialsToSave(
          readableVersion.parsedResponse,
          accountIndex,
          `${readableVersion.parsedResponse.DEVICE_UID}`,
          readableVersion.UserId,
          readableVersion.password,
          readableVersion.publicKey,
          readableVersion.orgId,
          readableVersion.AuthToken,
          readableVersion.userReference,
        );

        const account = await this.accountRepo.save(credentialsToSave.account_details);
        await this.bankLoginRepo.save(credentialsToSave.login_details);
        await this.generateGtbTransaction.execute(account);

        fs.unlink(filePath, (err) => {
          if (err) this.logger.error(`Error removing GTB cleanup file: ${err}`);
        });
        sendNewAccountInfo({ appRepo: this.appRepo, account, mailClient: this.mailClient });
        return this.preparedGtbAccountResponse(account);
      }

      const { user_id, password, business_id, public_key } = data;

      let response = await GtAuth(user_id, password, 'f1ffbffaffffffff');

      if (response.StatusCode !== 0) {
        if (response.Message.includes('PLEASE CLICK "FORGOT PASSWORD" AND FOLLOW THE PROMPTS')) {
          throw new BadRequestException('Invalid User Id or Password');
        }
        throw new BadRequestException(response.Message);
      }

      let parsedResponse = await JSON.parse(response.Message);

      if (parsedResponse.ACCOUNTS.ACCOUNT.length === 0) {
        response = await GtAuth(user_id, password, `${parsedResponse.DEVICE_UID}`);
      }
      const { AuthToken } = response;
      parsedResponse = await JSON.parse(response.Message);

      if (parsedResponse.ACCOUNTS.ACCOUNT.length > 1) {
        const readableDirectory = path.join(__dirname, '../../public/account');
        if (!fs.existsSync(readableDirectory)) {
          fs.mkdirSync(readableDirectory);
        }

        const filePath = path.join(
          __dirname,
          `../../public/account/gt_${parsedResponse.DEVICE_UID}.json`,
        );

        fs.writeFileSync(
          filePath,
          JSON.stringify({
            parsedResponse,
            user_id,
            public_key,
            password,
            business_id,
            AuthToken,
            user_reference,
          }),
        );

        // what to send back to confirm what the user wants to use
        const whatToSendForUserToConfirm = [] as {
          fullName: string;
          accountNumber: string;
          balance: number;
        }[];
        for (const currentIndex in parsedResponse.ACCOUNTS.ACCOUNT) {
          const currentAccount = parsedResponse.ACCOUNTS.ACCOUNT[currentIndex];
          whatToSendForUserToConfirm.push({
            fullName: currentAccount.CUSNAME,
            accountNumber: currentAccount.NUMBER,
            balance: `${currentAccount.CURRENCY} ${currentAccount.AVAILABLEBALANCE}`,
          } as any);
        }
      }

      const check = await this.checkForDuplicateAccountService.execute({
        account_no: parsedResponse.ACCOUNTS.ACCOUNT[0].NUMBER,
        business_id,
        public_key,
      });

      if (check) {
        throw new BadRequestException('Account has been linked');
      }

      const credentialsToSave = genCustomerCredentialsToSave(
        parsedResponse,
        0,
        `${parsedResponse.DEVICE_UID}`,
        user_id,
        password,
        public_key,
        business_id,
        AuthToken,
        user_reference,
      );

      const account = await this.accountRepo.save(credentialsToSave.account_details);
      credentialsToSave.login_details.account_id = account.id;
      await this.bankLoginRepo.save(credentialsToSave.login_details);
      await this.generateGtbTransaction.execute(account);
      sendNewAccountInfo({ appRepo: this.appRepo, account, mailClient: this.mailClient });
      const loginResult = this.preparedGtbAccountResponse(account);
      return loginResult;
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  private preparedGtbAccountResponse(newCustomer: CustomerAccount) {
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
