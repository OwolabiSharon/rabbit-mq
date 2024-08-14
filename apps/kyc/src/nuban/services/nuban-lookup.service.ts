import { Inject, Injectable, Logger } from '@nestjs/common';
import { middlewareInfoType } from 'apps/kyc/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { NubanLookupDto } from '../dto/nuban-lookup.dto';
import { NG_KYC_NUBAN } from '@app/common/database/models/ng_kyc_models/ng_kyc_nuban';
import { RmqService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { getNuban } from '../api/nuban-lookup.api';

@Injectable()
export class NubanLookupService {
  private readonly logger = new Logger(NubanLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_NUBAN)
    private readonly nubanRepo: Repository<NG_KYC_NUBAN>,
    @Inject(SaveApiCallService)
    private saveApiService: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(query: NubanLookupDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { accountNumber, bankCode } = query;
    const { charges, business_id } = middlewareInfo;

    try {
      const does_nuban_exist = await this.nubanRepo.findOne({
        where: { account_number: accountNumber },
      });

      if (does_nuban_exist) {
        this.saveApiService.execute('NUBAN LOOKUP', business_id, 'Successful', charges, 'Api');
        return does_nuban_exist;
      } else {
        const data = await getNuban({ accountNumber, bankCode });
        if (data?.response_code !== '00') {
          this.saveApiService.execute('NUBAN LOOKUP', business_id, 'Failed', 0, 'Api');
          return data?.message;
        }
        this.saveApiService.execute('NUBAN LOOKUP', business_id, 'Successful', charges, 'Api');
        data.account_data.account_number = accountNumber;
        const vinData = await this.nubanRepo.save(data.account_data);
        return vinData;
      }
    } catch (error) {
      this.logger.error(`Error occured while fetching data from Nuban lookup service: ${error}`);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
