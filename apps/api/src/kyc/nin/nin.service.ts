import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { KenyaNinLookupDto } from 'apps/kyc/src/nin/dto/kenya-nin-lookup.dto';
import { NinLookupQueryDto } from 'apps/kyc/src/nin/dto/nin-lookup.dto';
import { NinSelfieQueryDto } from 'apps/kyc/src/nin/dto/nin-selfie.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class NinClientService {
  private readonly logger = new Logger(NinClientService.name);
  constructor(@Inject(KYC_SERVICE) private ninClient: ClientProxy) {}

  async ninLookup(nin: NinLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.ninClient.send({ cmd: 'nin-lookup' }, { nin, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async selfienin(body: NinSelfieQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.ninClient.send({ cmd: 'nin-selfie-lookup' }, { body, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async kenyaNin(body: KenyaNinLookupDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.ninClient.send({ cmd: 'kenya-nin-lookup' }, { body, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
