import { CONNECT_SERVICE, CustomerAccount } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccessLoginDto, AccessQueryDto } from 'apps/connect/src/access/dto/access.dto';
import { FirstBankLoginDto, FirstBankQueryDto } from 'apps/connect/src/firstBank/dto/firstbank.dto';

@Injectable()
export class FirstBankClientService {
  private readonly logger = new Logger(FirstBankClientService.name);
  constructor(@Inject(CONNECT_SERVICE) private firstbankClient: ClientProxy) {}
  async firstBankLogin(data: FirstBankLoginDto, query: FirstBankQueryDto) {
    try {
      return this.firstbankClient.send({ cmd: 'firstbank-login' }, { data, query });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async generateStatement(account: CustomerAccount) {
    try {
      return this.firstbankClient.send({ cmd: 'firstbank-statement' }, account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
