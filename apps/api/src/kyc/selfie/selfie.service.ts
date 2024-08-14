import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SelfieLookupDto } from 'apps/kyc/src/selfie/dto/selfie-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class SelfieClientService {
  private readonly logger = new Logger(SelfieClientService.name);
  constructor(@Inject(KYC_SERVICE) private selfieClient: ClientProxy) {}

  async selfieLookup(query: SelfieLookupDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.selfieClient.send({ cmd: 'selfie-lookup' }, { query, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
