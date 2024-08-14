import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AdvancedPhoneLookupQueryDto } from 'apps/kyc/src/phoneNumber/dto/advanced-phone-lookup.dto';
import { BasicPhoneLookupQueryDto } from 'apps/kyc/src/phoneNumber/dto/basic-phone-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class PhoneNumberClientService {
  private readonly logger = new Logger(PhoneNumberClientService.name);
  constructor(@Inject(KYC_SERVICE) private phoneNumberClient: ClientProxy) {}

  async phoneBasic(query: BasicPhoneLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.phoneNumberClient.send({ cmd: 'phone-basic-lookup' }, { query, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async phoneAdvance(query: AdvancedPhoneLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.phoneNumberClient.send(
        { cmd: 'phone-advance-lookup' },
        { query, middlewareInfo },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
