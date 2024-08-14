import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiCall, App, Business } from '../../database';

export enum Endpoints {
  BVN_BASIC_LOOKUP = 'BVN BASIC LOOKUP',
  BVN_ADVANCE_LOOKUP = 'BVN ADVANCE LOOKUP',
  SELFIE_BVN_VERIFICATION = 'SELFIE BVN VERIFICATION',
  SELFIE_NIN_VERIFICATION = 'SELFIE NIN VERIFICATION',
  PHONE_NUMBER_ADVANCE_LOOKUP = 'PHONE NUMBER ADVANCE LOOKUP',
  PHONE_NUMBER_BASIC_LOOKUP = 'PHONE NUMBER BASIC LOOKUP',
  CAC_BASIC_LOOKUP = 'CAC BASIC LOOKUP',
  CAC_ADVANCE_LOOKUP = 'CAC ADVANCE LOOKUP',
  VIN_LOOKUP = 'VIN LOOKUP',
  TIN_LOOKUP = 'TIN LOOKUP',
  DRIVERS_LICENSE_LOOKUP = 'DRIVER LICENSE LOOKUP',
  NIN_LOOKUP = 'NIN LOOKUP',
  PASSPORT_LOOKUP = 'PASSPORT LOOKUP',
  NUBAN_LOOKUP = 'NUBAN LOOKUP',
  Authorization = 'Authorization',
}

export type endpointValues = `${Endpoints}`;

@Injectable()
export class SaveApiCallService {
  private readonly logger = new Logger(SaveApiCallService.name);
  constructor(
    @InjectRepository(ApiCall)
    private readonly apiRepo: Repository<ApiCall>,

    @InjectRepository(App)
    private readonly appRepo: Repository<App>,

    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async execute(
    endpoint: string,
    business_id: string,
    status: string,
    charge: number,
    source: string,
  ) {
    try {
      //gets the app to save with this apicall entity
      const app = await this.appRepo.findOne({ where: { business_id } });
      const api = new ApiCall();
      api.endpoint = endpoint;
      api.business_id = business_id;
      api.status = status;
      api.charge = charge;
      api.source = source;
      api.app = app;
      await this.apiRepo.save(api);

      //gets the balance from the business entity
      const business = await this.businessRepo.findOne({
        where: {
          id: business_id,
        },
      });
      const balance = business.balance - charge;
      business.balance = balance;
      await this.businessRepo.save(business);
    } catch (error) {
      this.logger.error(`Error when saving API Calls. ${error}`);
      throw error;
    }
  }
}
