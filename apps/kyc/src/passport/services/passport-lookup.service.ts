import { NG_KYC_Passport, RmqService } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { fork } from 'child_process';
import path from 'path';
import { Repository } from 'typeorm';
import { getPassport } from '../api/passport-lookup.api';
import { PassportLookupDto } from '../dto/passport-lookup.dto';

@Injectable()
export class PassportLookupService {
  private readonly logger = new Logger(PassportLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_Passport)
    private readonly passportRepo: Repository<NG_KYC_Passport>,
    @Inject(SaveApiCallService)
    private saveApiService: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(data: PassportLookupDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { passportNumber, firstName, lastName, dob } = data;
    const { business_id, charges } = middlewareInfo;
    console.log(data, middlewareInfo);
    try {
      const doesPassportExistInDatabase = await this.passportRepo.findOne({
        where: { passport_number: passportNumber },
      });
      if (doesPassportExistInDatabase) {
        this.saveApiService.execute('PASSPORT LOOKUP', business_id, 'Successful', charges, 'Api');
        return doesPassportExistInDatabase;
      }
      const data = await getPassport({ passportNumber, lastName, firstName, dob });
      if (data?.response_code !== '00') {
        this.saveApiService.execute('PASSPORT LOOKUP', business_id, 'Failed', 0, 'Api');
        return data?.message;
      }
      this.saveApiService.execute('PASSPORT LOOKUP', business_id, 'Successful', charges, 'Api');
      data.data.passport_number = passportNumber;
      return this.passportRepo.create(data.data);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
