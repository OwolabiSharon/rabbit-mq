import {
  AccessBankDetails,
  AccountLoginDetails,
  CustomerAccount,
  SaveApiCallService,
} from '@app/common';
import AccessAuthenticate from '@app/common/utils/banks/auth/access';
import FcmbAuthenticate from '@app/common/utils/banks/auth/fcmb';
import FirstBankAuthenticate from '@app/common/utils/banks/auth/first-bank';
import GTBAuthenticate from '@app/common/utils/banks/auth/gtb';
import { BankName } from '@app/common/utils/banks/enums';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';

export type ApiProps = {
  endpoint: string;
  privateKey: string;
  orgId: string;
  status: 'failed' | 'success';
  amount: number;
  source: 'Api' | 'Dashboard';
};

@Injectable()
export class ReAutheticateAccountService {
  private readonly logger = new Logger(ReAutheticateAccountService.name);

  constructor(
    @Inject(SaveApiCallService) private readonly saveApiCall: SaveApiCallService,
    @InjectRepository(AccountLoginDetails)
    private readonly loginRepo: Repository<AccountLoginDetails>,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    @InjectRepository(AccessBankDetails)
    private readonly accessRepo: Repository<AccessBankDetails>,
  ) {}

  async execute(account: CustomerAccount, charges: number, private_key: string, res: Response) {
    try {
      const login_details = await this.loginRepo.findOne({ where: { account_id: account.id } });
      if (account?.bank_name === BankName.FIRSTBANK) {
        const { readableAccountDetails, saveApiPayload } = await FirstBankAuthenticate(
          account,
          res,
          private_key,
          'Dashboard',
          login_details,
        );
        const accountPayload = {
          // session_id: authResponse.AuthToken,
          last_login: new Date(),
          session_exp: new Date(Date.now() + 1000 * 60 * 5),
        };

        await this.saveApiCall.execute(
          saveApiPayload.endpoint,
          saveApiPayload.business_id,
          saveApiPayload.status,
          charges,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account.id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account.id } });

        return updatedAccount;
      }
      if (account.bank_name === BankName.FCMB) {
        const authResponse: any = await FcmbAuthenticate(
          account,
          res,
          private_key,
          'Dashboard',
          login_details,
        );

        console.log(authResponse);

        const accountPayload = {
          // session_id: authResponse.AuthToken,
          last_login: new Date(),
          session_exp: new Date(Date.now() + 1000 * 60 * 5),
        };

        const saveApiPayload = {
          endpoint: 'Authorization',
          business_id: account.business_id!,
          status: 'failed',
          amount: 0.0,
          source: 'Dashboard',
        };

        await this.saveApiCall.execute(
          saveApiPayload.endpoint,
          saveApiPayload.business_id,
          saveApiPayload.status,
          charges,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account.id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account.id } });

        return updatedAccount;
      }
      if (account.bank_name === BankName.ACCESS) {
        const { saveApiPayload, session_id, csrf_token, bw_instance } = await AccessAuthenticate(
          account,
          res,
          private_key,
          'Dashboard',
          login_details,
        );

        const accountPayload = {
          session_id,
          last_login: new Date(),
          session_exp: new Date(Date.now() + 1000 * 60 * 5),
        };

        await this.saveApiCall.execute(
          saveApiPayload.endpoint,
          saveApiPayload.business_id,
          saveApiPayload.status,
          charges,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account.id }, accountPayload);

        await this.accessRepo.update({ account_id: account.id }, { csrf_token, bw_instance });

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account.id } });

        return updatedAccount;
      }
      if (account.bank_name === BankName.GTB) {
        const authResponse: any = await GTBAuthenticate(
          account,
          res,
          private_key,
          'Dashboard',
          login_details,
        );

        console.log(authResponse);

        const accountPayload = {
          session_id: authResponse.AuthToken,
          last_login: new Date(),
          session_exp: new Date(Date.now() + 1000 * 60 * 5),
        };

        const saveApiPayload = {
          endpoint: 'Authorization',
          business_id: account.business_id!,
          status: 'failed',
          amount: 0.0,
          source: 'Dashboard',
        };

        await this.saveApiCall.execute(
          saveApiPayload.endpoint,
          saveApiPayload.business_id,
          saveApiPayload.status,
          charges,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account.id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account.id } });

        return updatedAccount;
      }
      if (account.bank_name === BankName.ZENITH) {
        // const updatedAccount: any = await ZenithAuthenticate(
        //   account,
        //   res,
        //   private_key,
        //   'Dashboard',
        //   login_details,
        // );
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
