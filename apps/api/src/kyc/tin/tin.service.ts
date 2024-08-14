import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TinLookupQueryDto } from 'apps/kyc/src/tin/dto/tin-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class TinClientService {
  private readonly logger = new Logger(TinClientService.name);
  constructor(@Inject(KYC_SERVICE) private tinClient: ClientProxy) {}

  async tinLookup(tin: TinLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.tinClient.send({ cmd: 'tin-lookup' }, { tin, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
