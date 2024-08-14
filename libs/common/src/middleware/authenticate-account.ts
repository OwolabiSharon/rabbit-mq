import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { AccessBankDetails, AccountLoginDetails, App, CustomerAccount } from '../database';
import { NotFoundErrorException } from '../filters';
import { SaveApiCallService } from '../services';
import AccessAuthenticate from '../utils/banks/auth/access';
import FcmbAuthenticate from '../utils/banks/auth/fcmb';
import FirstBankAuthenticate from '../utils/banks/auth/first-bank';
import GTBAuthenticate from '../utils/banks/auth/gtb';
import ZenithAuthenticate from '../utils/banks/auth/zenith';
import { BankName } from '../utils/banks/enums';

interface CustomRequest extends Request {
  account?: CustomerAccount;
}

@Injectable()
export class AuthenticateAccountMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @InjectRepository(AccountLoginDetails)
    private readonly bankLoginRepo: Repository<AccountLoginDetails>,
    @InjectRepository(AccessBankDetails)
    private readonly accessRepo: Repository<AccessBankDetails>,
    @Inject(SaveApiCallService) private readonly saveApiCall: SaveApiCallService,
  ) {}
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const { account_id } = req.params;
    
    const account = await this.accountRepo.findOne({
      where: { id: account_id },
    });
    
    const login_details = await this.bankLoginRepo.findOne({ where: { account_id } });
    if (!account) {
      throw new NotFoundErrorException('Account not found');
    }

    const now = new Date();

    const app = await this.appRepo.findOne({ where: { public_key: account.public_key } });


    if (account?.bank_name === BankName.FIRSTBANK) {
      if (now > account.session_exp) {
        const { readableAccountDetails, saveApiPayload } = await FirstBankAuthenticate(
          account,
          res,
          app?.private_key!,
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
          saveApiPayload.amount,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account_id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account_id } });
        req.account = updatedAccount;
        return next();
      }
      req.account = account;
      return next();
    }
    if (account.bank_name === BankName.FCMB) {
      if (now > account.session_exp) {
        const authResponse: any = await FcmbAuthenticate(
          account,
          res,
          app?.private_key!,
          'Dashboard',
          login_details,
        );

        console.log(authResponse)

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
          saveApiPayload.amount,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account_id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account_id } });

        req.account = updatedAccount;
        return next();
      }
      req.account = account;
      return next();
    }
    if (account.bank_name === BankName.ACCESS) {
      if (now > account.session_exp) {
        const { saveApiPayload, session_id, csrf_token, bw_instance } = await AccessAuthenticate(
          account,
          res,
          app?.private_key!,
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
          saveApiPayload.amount,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account_id }, accountPayload);

        await this.accessRepo.update({ account_id }, { csrf_token, bw_instance });

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account_id } });

        req.account = updatedAccount;
        return next();
      }
      req.account = account;
      return next();
    }
    if (account.bank_name === BankName.GTB) {
      if (now > account.session_exp) {
        const authResponse: any = await GTBAuthenticate(
          account,
          res,
          app?.private_key!,
          'Dashboard',
          login_details,
        );

        console.log(authResponse)

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
          saveApiPayload.amount,
          saveApiPayload.source,
        );

        await this.accountRepo.update({ id: account_id }, accountPayload);

        const updatedAccount = await this.accountRepo.findOne({ where: { id: account_id } });
        req.account = updatedAccount;
        return next();
      }
      req.account = account;
      return next();
    }
    if (account.bank_name === BankName.ZENITH) {
      if (now > account.session_exp) {
        const updatedAccount: any = await ZenithAuthenticate(
          account,
          res,
          app?.private_key!,
          'Dashboard',
          login_details,
        );
        req.account = updatedAccount;
        return next();
      }
      req.account = account;
      return next();
    }
  }
}
