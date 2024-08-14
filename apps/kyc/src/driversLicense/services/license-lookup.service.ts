import { NG_KYC_DriverLicense, RmqService } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { fork } from 'child_process';
import path from 'path';
import { Repository } from 'typeorm';
import { getDriverLicense } from '../api/license-lookup.api';
import { LicenseLookupQueryDto } from '../dto/license-lookup.dto';

@Injectable()
export class LicenseLookupService {
  private readonly logger = new Logger(LicenseLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_DriverLicense)
    private readonly licenseRepo: Repository<NG_KYC_DriverLicense>,
    private saveApiService: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(
    query: LicenseLookupQueryDto,
    middlewareInfo: middlewareInfoType,
    context: RmqContext,
  ) {
    const { licenseNo } = query;
    const { business_id, charges } = middlewareInfo;

    try {
      const doesDriverLicenseExist = await this.licenseRepo.findOne({ where: { licenseNo } });
      if (doesDriverLicenseExist) {
        this.saveApiService.execute(
          'DRIVER LICENSE LOOKUP',
          business_id,
          'Successful',
          charges,
          'Api',
        );
        return doesDriverLicenseExist;
      }
      const message = await getDriverLicense({ licenseNo });

      if (message.error) {
        this.saveApiService.execute('DRIVER LICENSE LOOKUP', business_id, 'Failed', 0, 'Api');
        return message.error.includes('license_number') ? 'licenseNo not found' : message.error;
      }
      this.saveApiService.execute(
        'DRIVER LICENSE LOOKUP',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      return this.licenseRepo.create(message?.entity);
    } catch (error) {
      this.logger.error(`Error getting license from dojah. ${error}`);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
