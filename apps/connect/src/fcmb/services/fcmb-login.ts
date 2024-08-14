import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { FcmbQueryDto, LoginFcmbDto } from '../dto/fcmb-dto';
import * as path from 'path';
import * as fs from 'fs';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqService } from '@app/common';
import { Repository } from 'typeorm';
import { GenerateFcmbStatement } from './generate-statement';
import { generateHexValue, sendNewAccountInfo } from '@app/common/utils/banks';
import { fcmbLogin } from '../api/login-api';
import {
  genCustomerCredentialsToSaveOneAccount,
  getCredentialsWithAccount,
  getCustomToSave,
  GetReturnedFcmbRawValue,
} from '../functions';
import { fcmbGetAccountApi } from '../api/get-account-api';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FcmbLoginService {
  private readonly logger = new Logger(FcmbLoginService.name);

  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly fcmbGenerateStatement: GenerateFcmbStatement,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
    private readonly rmqService: RmqService,
  ) {}

  async execute(query: FcmbQueryDto, data: LoginFcmbDto, context) {
    const { account_no, user_reference } = query;

    try {
      if (account_no) {
        const { device_id } = query;
        const filePath = path.join(__dirname, `../../public/account/fcmb_${device_id}.json`);
        const readSavedFile = fs.readFileSync(filePath, 'utf8');
        const readableVersion = await JSON.parse(readSavedFile);
        const accountIndex = readableVersion.result.findIndex(
          (account: any) => account.account.accountNumber === account_no,
        );
        const accountsToSave = getCredentialsWithAccount(readableVersion.result, accountIndex);

        const check = await this.checkForDuplicateAccountService.execute({
          account_no: accountsToSave.account_no,
          business_id: readableVersion.details.orgId,
          public_key: readableVersion.details.publicKey,
        });

        if (check) {
          throw new BadRequestException('Account has been linked');
        }

        const fcmbBankPath = path.join(__dirname, `../../public/fcmb/fcmb_${device_id}.json`);
        const dataReaded = fs.readFileSync(fcmbBankPath, 'utf8');
        let customerToSave: any = await JSON.parse(dataReaded);

        fs.unlink(fcmbBankPath, (err) => {
          if (err) {
            this.logger.error(`Error Removing FCMB Multiple account file. Error: ${err}`);
          }
        });

        customerToSave = getCustomToSave(customerToSave, accountsToSave);

        const newCustomer = await this.accountRepo.save(customerToSave);

        /* Statements Session */
        await this.fcmbGenerateStatement.execute(newCustomer);

        fs.unlink(filePath, (err) => {
          if (err) {
            this.logger.error(
              `Error Removing FCMB Multiple account file. For Account Error: ${err}`,
            );
          }
        });
        sendNewAccountInfo({
          appRepo: this.appRepo,
          account: newCustomer,
          mailClient: this.mailClient,
        });
        return this.preparedFcmbAccountResponse(newCustomer);
      }

      const { username, password, public_key, business_id } = data;

      const device_id = generateHexValue();
      const response = await fcmbLogin(device_id, username, password);
      console.log(response.data);
      const formattedData = await GetReturnedFcmbRawValue(response.data);
      let customerToSave = genCustomerCredentialsToSaveOneAccount(
        formattedData.result,
        device_id,
        { username, password },
        public_key,
        business_id,
        user_reference,
      );
      const FCMBDirectory = path.join(__dirname, '../../public/fcmb');
      if (!fs.existsSync(FCMBDirectory)) {
        fs.mkdirSync(FCMBDirectory);
      }

      // write this details to a file
      const fcmbPath = path.join(__dirname, `../../public/fcmb/fcmb_${device_id}.json`);

      fs.writeFileSync(fcmbPath, JSON.stringify(customerToSave));

      const fcmbAccountData = await (await fcmbGetAccountApi(device_id, formattedData)).data;

      const readableDirectory = path.join(__dirname, '../../public/account');
      if (!fs.existsSync(readableDirectory)) {
        fs.mkdirSync(readableDirectory);
      }

      // check for multiple account
      if (fcmbAccountData.result.length > 1) {
        const filepath = path.join(__dirname, `../../public/account/fcmb_${device_id}.json`);
        fs.writeFileSync(
          filepath,
          JSON.stringify({
            result: fcmbAccountData.result,
            device_id,
            details: data,
          }),
        );

        const whatToSendForUserToConfirm = [];
        for (const currentIndex in fcmbAccountData.result) {
          const currentAccount = fcmbAccountData.result[currentIndex];
          whatToSendForUserToConfirm.push({
            fullName: currentAccount.account.accountName,
            accountNumber: currentAccount.account.accountNumber,
            balance: `${currentAccount.account.currencyCode} ${currentAccount.accountBalance.availableBalance}`,
          });
        }

        return {
          message: 'select account',
          data: { device_id, whatToSendForUserToConfirm },
        };
      }
      const accountDetails = getCredentialsWithAccount(fcmbAccountData.result, 0);
      const check = await this.checkForDuplicateAccountService.execute({
        account_no: accountDetails.account_no,
        business_id,
        public_key,
      });

      if (check) {
        throw new BadRequestException('Account has been linked');
      }
      customerToSave = getCustomToSave(customerToSave.account_details, accountDetails);

      fs.unlink(fcmbPath, (err) => {
        this.logger.error(`Error deleting fcmb file ${err}`);
      });

      const newCustomer = await this.accountRepo.save(customerToSave.account_details);
      await this.bankLoginRepo.save(customerToSave.login_details);

      await this.fcmbGenerateStatement.execute(newCustomer);

      return this.preparedFcmbAccountResponse(newCustomer);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  private preparedFcmbAccountResponse(newCustomer: CustomerAccount) {
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
        userReeference: newCustomer.user_reference,
        bvn: newCustomer.bvn.substring(0, 4),
      },
    };
  }
}
