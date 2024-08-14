import { KENYA_KYC_NIN, NG_KYC_NIN, RmqService } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { Repository } from 'typeorm';
import { getKenyaNin } from '../api/kenya-nin-lookup.api';
import { getnin } from '../api/nin-lookup.api';
import { KenyaNinLookupDto } from '../dto/kenya-nin-lookup.dto';

@Injectable()
export class KenyaNinLookupService {
  private readonly logger = new Logger(KenyaNinLookupService.name);

  constructor(
    @InjectRepository(KENYA_KYC_NIN)
    private readonly ninRepo: Repository<KENYA_KYC_NIN>,
    @Inject(SaveApiCallService)
    private readonly saveApiCall: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(data: KenyaNinLookupDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { business_id, charges } = middlewareInfo;

    const { nin, firstname, lastname, dob } = data;

    try {
      const ninExistInDatabase = await this.ninRepo.findOne({ where: { nin } });
      if (ninExistInDatabase) {
        this.saveApiCall.execute('KENYA NIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return ninExistInDatabase;
      } else {
        const data = await getKenyaNin(nin, firstname, lastname, dob);
        if (data?.response_code !== '00') {
          this.saveApiCall.execute('KENYA NIN LOOKUP', business_id, 'Failed', 0, 'Api');
          return data?.message;
        }
        this.saveApiCall.execute('KENYA NIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return this.ninRepo.create(data.nin_data);
      }
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
