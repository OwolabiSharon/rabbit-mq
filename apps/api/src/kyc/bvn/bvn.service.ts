import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BvnLookupQueryDto } from 'apps/kyc/src/bvn/dto/bvn-lookup.dto';
import { SelfieBvnQueryDto } from 'apps/kyc/src/bvn/dto/selfie-bvn.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class BvnClientService {
  private readonly logger = new Logger(BvnClientService.name);
  constructor(@Inject(KYC_SERVICE) private bvnClient: ClientProxy) {}

  async bvnBasic(bvn: BvnLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.bvnClient.send({ cmd: 'bvn-basic-lookup' }, { bvn, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
 
  async bvnAdvance(bvn: BvnLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.bvnClient.send({ cmd: 'bvn-advance-lookup' }, { bvn, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async selfieBvn(body: SelfieBvnQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.bvnClient.send({ cmd: 'bvn-selfie-lookup' }, { body, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
