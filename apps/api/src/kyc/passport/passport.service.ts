import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportLookupDto } from 'apps/kyc/src/passport/dto/passport-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class PassportClientService {
  private readonly logger = new Logger(PassportClientService.name);
  constructor(@Inject(KYC_SERVICE) private passportClient: ClientProxy) {}

  async passportLookup(body: PassportLookupDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.passportClient.send({ cmd: 'passport-lookup' }, { body, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
