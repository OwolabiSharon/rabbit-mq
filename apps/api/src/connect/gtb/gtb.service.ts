import { CONNECT_SERVICE, CustomerAccount } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GtbLoginDto, GtbQueryDto } from 'apps/connect/src/gtb/dto/gtb.dto';

@Injectable()
export class GtbClientService {
  private readonly logger = new Logger(GtbClientService.name);
  constructor(@Inject(CONNECT_SERVICE) private gtbClient: ClientProxy) {}
  async GtbLogin(data: GtbLoginDto, query: GtbQueryDto) {
    try {
      return this.gtbClient.send({ cmd: 'gtb-login' }, { data, query });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async generateStatement(account: CustomerAccount) {
    try {
      return this.gtbClient.send({ cmd: 'gtb-statement' }, account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
