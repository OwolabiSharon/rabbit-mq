import {
  AccessBankDetails,
  AccountLoginDetails,
  CustomerAccount,
  decryptAccountPassword,
  Encrypt,
  getDateRange,
} from '@app/common';
import { BankName } from '@app/common/utils/banks/enums';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessHeaders } from 'apps/connect/src/access/api/headers';
import { GenerateAccessStatement } from 'apps/connect/src/access/services/generate-statement';
import { LOGIN_SECRET } from 'apps/connect/src/config';
import { GetReturnedFcmbRawValue } from 'apps/connect/src/fcmb/functions';
import { GenerateFcmbStatement } from 'apps/connect/src/fcmb/services/generate-statement';
import { FirstBankSendRequest } from 'apps/connect/src/firstBank/api/firstbank-fetch';
import FirstBankHeaders from 'apps/connect/src/firstBank/api/headers';
import { GenerateFirstBankStatement } from 'apps/connect/src/firstBank/services/firstbank-generate-statement';
import GtbHeaders from 'apps/connect/src/gtb/api/headers';
import { GtbEncryptString } from 'apps/connect/src/gtb/functions';
import { GenerateGtbTransactionService } from 'apps/connect/src/gtb/services/gtb-generate-transaction';
import axios from 'axios';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { SaveApiCallService } from '../save-api-call';
import { ReAutheticateAccountService } from './re-authenticate';
import { parseStringPromise } from 'xml2js';

Injectable();
export class ApiSyncService {
  private readonly logger = new Logger(ApiSyncService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    @InjectRepository(AccessBankDetails)
    private readonly accessRepo: Repository<AccessBankDetails>,
    @InjectRepository(AccountLoginDetails)
    private readonly loginRepo: Repository<AccountLoginDetails>,
    private readonly reAutheticateAccountService: ReAutheticateAccountService,
    private readonly firstBankGenerateStatement: GenerateFirstBankStatement,
    private readonly generateAccessStatement: GenerateAccessStatement,
    private readonly fcmbGenerateStatement: GenerateFcmbStatement,
    private readonly generateGtbTransaction: GenerateGtbTransactionService,
    private readonly saveApiCall: SaveApiCallService,
  ) {}

  async execute(middlewareInfo: any, res: Response, context: RmqContext) {
    const { account, charges, private_key } = middlewareInfo;
    const now = new Date();
    if (account.bank_name === BankName.FIRSTBANK) {
      let updatedAccount: CustomerAccount = account;
      if (now > updatedAccount.session_exp)
        updatedAccount = await this.reAutheticateAccountService.execute(
          account,
          charges,
          private_key,
          res,
        );
      const accountDetailsMessage = JSON.stringify({ sessionID: updatedAccount.session_id });
      const encryptedSessionId = await Encrypt(accountDetailsMessage, updatedAccount.device_id);
      const headers = FirstBankHeaders(updatedAccount.device_id, updatedAccount.session_id, 88);
      const readableAccountDetails = await FirstBankSendRequest(
        'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/account/list/',
        encryptedSessionId,
        headers,
        updatedAccount.device_id,
      );

      if (readableAccountDetails.code !== 0) {
        this.logger.error(
          `Error Retrieving FirstBank Account List for user:${updatedAccount.full_name}-${updatedAccount.id}. Error message:${readableAccountDetails.description}`,
        );
        return;
      }

      // find accountNo
      const dataToUpdate = readableAccountDetails.accounts.find(
        (account: any) => account.accountNumber === updatedAccount.account_no,
      );
      await this.accountRepo.update(
        { id: account.id },
        {
          account_type: dataToUpdate.accountType,
          currency: dataToUpdate.currencyCode,
          account_status: dataToUpdate.active,
          balance: dataToUpdate.availableBalance,
        },
      );

      const newUpdatedAccount = await this.accountRepo.findOne({ where: { id: account.id } });

      const today = new Date();
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

      const dateRange = getDateRange(lastYear, today);

      await this.firstBankGenerateStatement.execute(newUpdatedAccount, dateRange);
      await this.saveApiCall.execute({
        endpoint: 'Account Sync',
        private_key,
        business_id: account.business_id!,
        status: 'success',
        amount: charges,
        source: 'Api',
      });
      const dataTosend = {
        status: 'pending',
        hasNewData: '',
        code: 0,
      };
      return res.status(200).json(dataTosend);
    }
    if (account.bank_name === BankName.ACCESS) {
      let updatedAccount: CustomerAccount = account;
      if (now > updatedAccount.session_exp)
        updatedAccount = await this.reAutheticateAccountService.execute(
          account,
          charges,
          private_key,
          res,
        );
      const access = await this.accessRepo.findOne({ where: { account_id: updatedAccount.id } });
      const accessHeaders = AccessHeaders(updatedAccount.session_id, access.bw_instance);
      const accessDetailsParams = new URLSearchParams();
      accessDetailsParams.append(access.csrf_token.split('=')[0], access.csrf_token.split('=')[1]);

      const accessDetailsResponse = await axios.post(
        'https://ibank.accessbankplc.com/RetailBank/bml/account/accountsCustomer.bml',
        accessDetailsParams,
        {
          headers: { ...accessHeaders },
        },
      );
      const accessDetailsParsedString = await parseStringPromise(accessDetailsResponse.data);
      const dataToUpdate = accessDetailsParsedString.response.collection[0].model.find(
        (account: any) => account.accountno[0] === updatedAccount.account_no,
      );
      await this.accountRepo.update(
        { id: account.id },
        {
          currency: dataToUpdate.currency[0],
          account_type: dataToUpdate.type[0],
          balance: dataToUpdate.balance_home_raw[0],
        },
      );

      const newDataToUpdate = await this.accountRepo.findOne({ where: { id: account.id } });
      await this.saveApiCall.execute({
        endpoint: 'Account Sync',
        private_key,
        business_id: account.business_id!,
        status: 'success',
        amount: charges,
        source: 'Api',
      });

      await this.generateAccessStatement.execute(newDataToUpdate, context);
      const dataTosend = {
        status: 'pending',
        hasNewData: '',
        code: 0,
      };
      return res.status(200).json(dataTosend);
    }
    if (account.bank_name === BankName.FCMB) {
      let updatedAccount: CustomerAccount = account;
      if (now > updatedAccount.session_exp)
        updatedAccount = await this.reAutheticateAccountService.execute(
          account,
          charges,
          private_key,
          res,
        );
      const fcmbAccountReponse = await axios.get(
        'https://mobileappserver.fcmb.com/moneytor-service/api/v1/fcmb/account/account_with_balance',
        {
          headers: {
            Host: 'mobileappserver.fcmb.com',
            Deviceid: updatedAccount.device_id,
            'Client-Id': '3MNT0001',
            Authorization: `bearer ${updatedAccount.session_id}`,
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/4.9.3',
          },
        },
      );
      const fcmbAccountData = await GetReturnedFcmbRawValue(fcmbAccountReponse.data);
      const dataToUpdate = fcmbAccountData.result.find(
        (account: any) => account.account.accountNumber === updatedAccount.account_no,
      );
      await this.accountRepo.update(
        { id: account.id },
        {
          account_type: dataToUpdate.account.accountType,
          phone_number: dataToUpdate.account.phoneNumber,
          currency: dataToUpdate.account.currencyCode,
          customer_account_id: dataToUpdate.account.id,
          balance: dataToUpdate.accountBalance.availableBalance,
          account_status: dataToUpdate.account.active === true ? 'active' : 'inactive',
          country: dataToUpdate.account.schemeCode.accountProvider.country.name,
        },
      );

      const newDataToUpdate = await this.accountRepo.findOne({ where: { id: account.id } });

      await this.fcmbGenerateStatement.execute(newDataToUpdate);

      await this.saveApiCall.execute({
        endpoint: 'Account Sync',
        private_key,
        business_id: account.business_id!,
        status: 'success',
        amount: charges,
        source: 'Api',
      });
      const dataTosend = {
        status: 'pending',
        hasNewData: '',
        code: 0,
      };
      return res.status(200).json(dataTosend);
    }
    if (account.bank_name === BankName.GTB) {
      let updatedAccount: CustomerAccount = account;
      if (now > updatedAccount.session_exp)
        updatedAccount = await this.reAutheticateAccountService.execute(
          account,
          charges,
          private_key,
          res,
        );
      const login_details = await this.loginRepo.findOne({
        where: { account_id: updatedAccount.id },
      });
      const password = decryptAccountPassword(login_details.password, LOGIN_SECRET);
      const plainText = `{"UserId":"${login_details.login_id}","Password":"${password}"}`;
      const encrypted = GtbEncryptString(plainText);
      const header = GtbHeaders();
      const response = await axios.post(
        'https://gtworld.gtbank.com/GTWorldApp/api/Authentication/login-enc',
        {
          Uuid: updatedAccount.device_id,
          Platform: 'Android',
          Model: 'Samsung Galaxy S9',
          Manufacturer: 'Genymotion',
          DeviceToken: '',
          UserId: `${login_details.login_id}`,
          OtherParams: `${encrypted}`,
          isGAPSLite: '0',
          Channel: 'GTWORLDv1.0',
          appVersion: '1.9.19',
          GLUserId: '',
          GLUsername: '',
        },
        { headers: { ...header } },
      );

      const readableDetails = JSON.parse(response.data);

      if (readableDetails.StatusCode !== 0) {
        await this.saveApiCall.execute({
          endpoint: 'Account Sync',
          private_key,
          business_id: account.business_id!,
          status: 'failed',
          amount: charges,
          source: 'Api',
        });
        if (
          readableDetails.Message.includes('PLEASE CLICK "FORGOT PASSWORD" AND FOLLOW THE PROMPTS')
        ) {
          return res
            .status(400)
            .json({ status: 'error', code: 10, msg: 'Invalid UserId or Password' });
        }
        return res.status(400).json({ status: 'error', code: 10, msg: readableDetails.Message });
      }
      const { AuthToken } = readableDetails;
      const parsedResponse = await JSON.parse(readableDetails.Message);
      const dataToUpdate = parsedResponse.ACCOUNTS.ACCOUNT.find(
        (account: any) => account.NUMBER === updatedAccount.account_no,
      );

      await this.accountRepo.update(
        { id: account.id },
        {
          session_id: AuthToken,
          session_exp: new Date(Date.now() + 1000 * 60 * 5),
          last_login: new Date(),
          account_type: dataToUpdate.ACCOUNTTYPE,
          currency: dataToUpdate.CURRENCY,
          phone_number: dataToUpdate.TELNUM,
          balance: dataToUpdate.AVAILABLEBALANCE,
        },
      );

      const newDataToUpdate = await this.accountRepo.findOne({ where: { id: account.id } });

      await this.generateGtbTransaction.execute(newDataToUpdate);
      await this.saveApiCall.execute({
        endpoint: 'Account Sync',
        private_key,
        business_id: account.business_id!,
        status: 'success',
        amount: charges,
        source: 'Api',
      });
      const dataTosend = {
        status: 'pending',
        hasNewData: '',
        code: 0,
      };
      return res.status(200).json(dataTosend);
    }
    if (account.bank_name === BankName.ZENITH) {
      let updatedAccount: CustomerAccount = account;
      if (now > updatedAccount.session_exp)
        updatedAccount = await this.reAutheticateAccountService.execute(
          account,
          charges,
          private_key,
          res,
        );
    }
  }
}
