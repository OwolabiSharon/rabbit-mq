import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VinLookupDto } from 'apps/kyc/src/vin/dto/vin-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class VinClientService {
  private readonly logger = new Logger(VinClientService.name);
  constructor(@Inject(KYC_SERVICE) private vin: ClientProxy) {}

  async vinLookup(body: VinLookupDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.vin.send({ cmd: 'vin-lookup' }, { body, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
