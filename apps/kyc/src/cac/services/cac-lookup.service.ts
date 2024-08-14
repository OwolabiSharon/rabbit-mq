import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { middlewareInfoType } from 'apps/kyc/types';
import axios from 'axios';
import { RmqService, SaveApiCallService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { CacCorporateQueryDto } from '../dto';

@Injectable()
export class CacLookupService {
  private readonly logger = new Logger(CacLookupService.name);

  constructor(
    @Inject(SaveApiCallService) private saveApiService: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(
    query: CacCorporateQueryDto,
    middlewareInfo: middlewareInfoType,
    context: RmqContext,
  ) {
    const { charges, business_id } = middlewareInfo;
    const { rcNumber } = query;

    try {
      const response = await axios.post(
        'https://searchapp.cac.gov.ng/searchapp/api/public-search/company-business-name-it',
        {
          searchTerm: rcNumber,
        },
      );

      const data = response.data;
      if (!data.data) {
        return data.message;
      }
      await this.saveApiService.execute(
        'CAC BASIC LOOKUP',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      return data.data[0];
    } catch (error) {
      this.logger.error(`Error occured while fetching data from cac lookup service: ${error}`);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
