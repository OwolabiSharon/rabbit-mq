import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { middlewareInfoType } from 'apps/kyc/types';
import { CacCorporateQueryDto } from '../dto/cac-corporate.dto';
import axios from 'axios';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { IServerErrorException, RmqService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
const _ = require('lodash');

@Injectable()
export class CacCorporateService {
  private readonly logger = new Logger(CacCorporateService.name);

  constructor(
    @Inject(SaveApiCallService) private saveApiService: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(
    query: CacCorporateQueryDto,
    middlewareInfo: middlewareInfoType,
    context: RmqContext,
  ) {
    const { rcNumber } = query;
    const { charges, business_id } = middlewareInfo;
    try {
      const { data } = await axios.post(
        'https://searchapp.cac.gov.ng/searchapp/api/public-search/company-business-name-it',
        {
          searchTerm: rcNumber,
        },
      );

      if (data.data.length <= 0) {
        throw new IServerErrorException('Something went wrong');
      }

      const { id } = data.data[0];
      const response = await axios.get(
        `https://searchapp.cac.gov.ng/searchapp/api/status-report/find/company-affiliates/${id}`,
      );

      const result = response.data;

      this.saveApiService.execute('CAC ADVANCE LOOKUP', business_id, 'Successful', charges, 'Api');

      let newData = result.data.map((item: any) => {
        item = _.omit(item, ['corporationCompany', 'id']);
        item.affiliatesResidentialAddress = _.omit(item.affiliatesResidentialAddress, ['id']);
        item.countryFk = _.omit(item.countryFk, ['id']);
        item.affiliateTypeFk = _.omit(item.affiliateTypeFk, ['id']);
        item.affiliatesPscInformation = _.omit(item.affiliatesPscInformation, ['id']);
        return item;
      });

      const dataToReturned = {
        state: data.data[0].state,
        address: data.data[0].address,
        status: data.data[0].status,
        city: data.data[0].city,
        email: data.data[0].email,
        companyStatus: data.data[0].companyStatus,
        lga: data.data[0].lga,
        rcNumber: data.data[0].rcNumber,
        registrationDate: data.data[0].registrationDate,
        approvedName: data.data[0].approvedName,
        directors: newData,
      };
      return dataToReturned;
    } catch (error: any) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
