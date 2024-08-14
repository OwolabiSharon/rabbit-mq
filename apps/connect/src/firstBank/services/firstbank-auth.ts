import {
  AccountLoginDetails,
  App,
  CustomerAccount,
  Encrypt,
  getDateRange,
  MAIL_SERVICE,
  sendNewAccountInfo,
} from '@app/common';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import FirstBankHeaders from '../api/headers';
import { genCustomerCredentialsToSave, getCredentialsWithAccount } from '../functions';
import * as path from 'path';
import * as fs from 'fs';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstBankSendRequest } from '../api/firstbank-fetch';
import { GenerateFirstBankStatement } from './firstbank-generate-statement';
import console from 'console';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FirstBankAuthProcess {
  private readonly logger = new Logger(FirstBankAuthProcess.name);

  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly firstBankGenerateStatement: GenerateFirstBankStatement,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
  ) {}

  async execute(
    deviceID: string,
    pin: any,
    public_key: any,
    business_id: string,
    cardNumber: any,
    userReference: string,
  ) {
    console.log(business_id);
    const message = JSON.stringify({
      deviceID,
      pin,
      pushToken: '1111',
      appVersion: '2.7.0',
    });

    // encrypt the data
    const encryptedData = await Encrypt(message, deviceID);
    const firstBankHeader = FirstBankHeaders(deviceID, null, 128);
    firstBankHeader.Customtype = true;
    firstBankHeader.Connection = 'close';

    const readableVersion = await FirstBankSendRequest(
      'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/user/authenticate',
      encryptedData,
      firstBankHeader,
      deviceID,
    );

    if (readableVersion.code !== 0) {
      throw new InternalServerErrorException(readableVersion.description);
    }

    const newAccountToSave = genCustomerCredentialsToSave(
      readableVersion,
      deviceID,
      pin,
      public_key,
      business_id,
      userReference,
    );

    const firstBankDirectory = path.join(__dirname, '../../public/firstBank');
    if (!fs.existsSync(firstBankDirectory)) {
      fs.mkdirSync(firstBankDirectory);
    }

    // write this details to a file
    const firstBankPath = path.join(__dirname, `../../public/firstBank/firstBank_${deviceID}.json`);

    fs.writeFileSync(firstBankPath, JSON.stringify(newAccountToSave));

    /* Get Account Details after login is successful */
    // create data to encrypt
    const accountDetailsMessage = JSON.stringify({
      sessionID: newAccountToSave.account_details.session_id,
    });

    // encrypt the sessionId to be sent
    const encryptedSessionId = await Encrypt(accountDetailsMessage, deviceID);

    const headers = FirstBankHeaders(deviceID, newAccountToSave.account_details.session_id, 88);

    const readableAccountDetails = await FirstBankSendRequest(
      'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/account/list/',
      encryptedSessionId,
      headers,
      deviceID,
    );

    if (readableAccountDetails.code !== 0) {
      throw new BadRequestException(readableAccountDetails.description);
    }

    const readableDirectory = path.join(__dirname, '../../public/account');
    if (!fs.existsSync(readableDirectory)) {
      fs.mkdirSync(readableDirectory);
    }

    if (readableAccountDetails.accounts.length > 1) {
      const filepath = path.join(__dirname, `../../public/account/firstBank_${deviceID}.json`);
      fs.writeFileSync(filepath, JSON.stringify(readableAccountDetails, public_key, business_id));

      // what to send back to confirm what the user wants to use
      const whatToSendForUserToConfirm = [];
      for (const currentIndex in readableAccountDetails.accounts) {
        const currentAccount = readableAccountDetails.accounts[currentIndex];
        whatToSendForUserToConfirm.push({
          fullName: newAccountToSave.account_details.full_name,
          accountNumber: currentAccount.accountNumber,
          balance: currentAccount.availableBalance,
        });
      }
      return {
        message: 'select account',
        data: { deviceID, whatToSendForUserToConfirm },
      };
    }

    const accountDetails = getCredentialsWithAccount(readableAccountDetails, 0);

    const check = await this.checkForDuplicateAccountService.execute({
      account_no: accountDetails.account_no,
      business_id,
      public_key,
    });

    if (check) {
      throw new BadRequestException('Account has been linked');
    }
    // create firstBank
    newAccountToSave.account_details.account_no = accountDetails.account_no;
    newAccountToSave.account_details.account_type = accountDetails.account_type;
    newAccountToSave.account_details.currency = accountDetails.currency;
    newAccountToSave.account_details.account_status = accountDetails.account_status;
    newAccountToSave.balance = accountDetails.balance;
    fs.unlink(firstBankPath, (err: any) => {
      if (err)
        this.logger.error(
          `Delete firstBank multiple account file: ${err?.message} caused by: ${err?.cause}`,
        );
    });
    const newCustomer = await this.accountRepo.save(newAccountToSave.account_details);
    await this.bankLoginRepo.save(newAccountToSave.login_details);

    /*   Account statement     */
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    const dateRange = getDateRange(lastYear, today);

    await this.firstBankGenerateStatement.execute(newCustomer, dateRange);

    fs.unlink(path.join(__dirname, `../../public/firstBank/${cardNumber}.json`), (err) => {
      if (err) {
        this.logger.error(`Error deleting FirstBank CardStatement, ${err?.message}`);
      }
    });
    sendNewAccountInfo({
      appRepo: this.appRepo,
      account: newCustomer,
      mailClient: this.mailClient,
    });
    return {
      message: 'ok',
      account: {
        id: newCustomer.id,
        institution: {
          name: newCustomer.bank_name,
          bankCode: newCustomer?.bank_code,
          type: newCustomer?.account_type,
        },
        name: newCustomer.full_name,
        accountNumber: newCustomer.account_no,
        balance: newCustomer?.balance,
        currency: newCustomer?.currency,
        userReference: newCustomer?.user_reference,
        bvn: newCustomer?.bvn?.substring(0, 4),
      },
    };
  }
}
