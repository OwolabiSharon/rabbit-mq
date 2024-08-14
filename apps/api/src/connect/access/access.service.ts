import { CONNECT_SERVICE, CustomerAccount } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AccessClientService {
  private readonly logger = new Logger(AccessClientService.name);
  constructor(@Inject(CONNECT_SERVICE) private accessClient: ClientProxy) {}
  async accessLogin(data: any, query: any) {
    try {
      return this.accessClient.send({ cmd: 'access-login' }, { query, data });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async generateStatement(account: CustomerAccount) {
    try {
      return this.accessClient.send({ cmd: 'access-statement' }, account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
