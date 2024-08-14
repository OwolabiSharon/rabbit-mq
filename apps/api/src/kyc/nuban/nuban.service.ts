import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NubanLookupDto } from 'apps/kyc/src/nuban/dto/nuban-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class NubanClientService {
  private readonly logger = new Logger(NubanClientService.name);
  constructor(@Inject(KYC_SERVICE) private nubanClient: ClientProxy) {}

  async nubanLookup(query: NubanLookupDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.nubanClient.send({ cmd: 'nuban-lookup' }, { query, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
