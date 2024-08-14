import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CacCorporateQueryDto, CacLookupQueryDto } from 'apps/kyc/src/cac/dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class CacClientService {
  private readonly logger = new Logger(CacClientService.name);
  constructor(@Inject(KYC_SERVICE) private cacCllent: ClientProxy) {}

  async cacBasic(cac: CacLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.cacCllent.send({ cmd: 'cac-basic-lookup' }, { cac, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cacAdvance(cac: CacCorporateQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.cacCllent.send({ cmd: 'cac-advance-lookup' }, { cac, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
