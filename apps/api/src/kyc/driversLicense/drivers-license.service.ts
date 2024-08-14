import { KYC_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LicenseLookupQueryDto } from 'apps/kyc/src/driversLicense/dto/license-lookup.dto';
import { middlewareInfoType } from 'apps/kyc/types';

@Injectable()
export class DriversLicenseClientService {
  private readonly logger = new Logger(DriversLicenseClientService.name);
  constructor(@Inject(KYC_SERVICE) private licenseClient: ClientProxy) {}

  async licenseLookup(license: LicenseLookupQueryDto, middlewareInfo: middlewareInfoType) {
    try {
      return this.licenseClient.send({ cmd: 'cac-basic-lookup' }, { license, middlewareInfo });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
