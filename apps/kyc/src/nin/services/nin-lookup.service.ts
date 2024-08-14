import { NG_KYC_NIN, RmqService } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { Repository } from 'typeorm';
import { getnin } from '../api/nin-lookup.api';

@Injectable()
export class NinLookupService {
  private readonly logger = new Logger(NinLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_NIN)
    private readonly ninRepo: Repository<NG_KYC_NIN>,
    @Inject(SaveApiCallService)
    private readonly saveApiCall: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(nin: string, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { business_id, charges } = middlewareInfo;
    if (!nin) throw new BadRequestException('please pass in a valid nin');
    try {
      const ninExistInDatabase = await this.ninRepo.findOne({ where: { nin } });
      if (ninExistInDatabase) {
        this.saveApiCall.execute('NIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return ninExistInDatabase;
      } else {
        const data = await getnin(nin);
        if (data?.response_code !== '00') {
          this.saveApiCall.execute('NIN LOOKUP', business_id, 'Failed', 0, 'Api');
          return data?.message;
        }
        this.saveApiCall.execute('NIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return this.ninRepo.create(data.nin_data);
      }
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
