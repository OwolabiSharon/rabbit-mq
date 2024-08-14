import { CONNECT_SERVICE, CustomerAccount } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FcmbQueryDto, LoginFcmbDto } from 'apps/connect/src/fcmb/dto/fcmb-dto';
import { GtbLoginDto, GtbQueryDto } from 'apps/connect/src/gtb/dto/gtb.dto';

@Injectable()
export class FcmbClientService {
  private readonly logger = new Logger(FcmbClientService.name);
  constructor(@Inject(CONNECT_SERVICE) private fcmbClient: ClientProxy) {}
  async fcmbLogin(data: LoginFcmbDto, query: FcmbQueryDto) {
    try {
      return this.fcmbClient.send({ cmd: 'fcmb-login' }, { data, query });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async generateStatement(account: CustomerAccount) {
    try {
      return this.fcmbClient.send({ cmd: 'fcmb-statement' }, account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
