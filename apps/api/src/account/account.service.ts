import { CONNECT_SERVICE } from '@app/common';
import { CustomRequestTwo } from '@app/common/utils/response';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Injectable()
export class AccountClientService {
  private readonly logger = new Logger(AccountClientService.name);
  constructor(@Inject(CONNECT_SERVICE) private accountClient: ClientProxy) {}
  async reAuthorizeAccount(req: CustomRequestTwo, res: Response) {
    try {
      return this.accountClient.send({ cmd: 're-authorize-account' }, { req, res });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async apiSync(req: CustomRequestTwo, res: Response) {
    try {
      return this.accountClient.send({ cmd: 'api-sync' }, { req, res });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async apiGetAccount(middlewareInfo: any) {
    try {
      return this.accountClient.send({ cmd: 'api-get-account' }, middlewareInfo);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async apiGetAccounts(middlewareInfo: any) {
    try {
      return this.accountClient.send({ cmd: 'api-get-accounts' }, middlewareInfo);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async apiGetIdentity(middlewareInfo: any) {
    try {
      return this.accountClient.send({ cmd: 'api-get-identity' }, middlewareInfo);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async dashGetBankAccount(id: string) {
    try {
      return this.accountClient.send({ cmd: 'dash-get-bank-account' }, id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async dashGetBankAccounts(public_key: string, business_id: string) {
    try {
      return this.accountClient.send(
        { cmd: 'dash-get-bank-accounts' },
        { public_key, business_id },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async dashGetAccounts(public_key: string, business_id: string) {
    try {
      return this.accountClient.send({ cmd: 'dash-get-accounts' }, { public_key, business_id });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async dashGetAccount(bvn: string, business_id: string, public_key: string) {
    try {
      return this.accountClient.send({ cmd: 'dash-get-account' }, { bvn, business_id, public_key });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async dashGetIdentity(id: string) {
    try {
      return this.accountClient.send({ cmd: 'dash-get-identity' }, id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
