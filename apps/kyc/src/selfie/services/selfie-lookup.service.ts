import { IServerErrorException, RmqService, SaveApiCallService } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { middlewareInfoType } from 'apps/kyc/types';
import { getSelfie } from '../api/selfie-lookup.api';
import { SelfieLookupDto } from '../dto/selfie-lookup.dto';

@Injectable()
export class SelfieLookupService {
  private readonly logger = new Logger(SelfieLookupService.name);
  constructor(
    private rmqService: RmqService,
    @Inject(SaveApiCallService) private readonly saveApiService: SaveApiCallService,
  ) {}

  async execute(data: SelfieLookupDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { photo_id, selfie_image } = data;
    const { business_id, charges } = middlewareInfo;
    try {
      const data = await getSelfie({ photo_id, selfie_image });
      if (data.error) {
        this.saveApiService.execute('PHONE NUMBER BASIC LOOKUP', business_id, 'Failed', 0, 'Api');
        throw new IServerErrorException('Could not look up selfie');
      }
      this.saveApiService.execute(
        'PHONE NUMBER BASIC LOOKUP',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
