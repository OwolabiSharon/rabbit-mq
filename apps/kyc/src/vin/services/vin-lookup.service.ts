import { Injectable, Logger } from '@nestjs/common';
import { middlewareInfoType } from 'apps/kyc/types';
import { VinLookupDto } from '../dto/vin-lookup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NG_KYC_VIN, RmqService } from '@app/common';
import { Repository } from 'typeorm';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { RmqContext } from '@nestjs/microservices';
import axios from 'axios';
import { IDENTITYPASSAPPID, IDENTITYPASSSECRETKEY } from 'apps/kyc/config';

@Injectable()
export class VinLookupService {
  private readonly logger = new Logger(VinLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_VIN)
    private readonly vinRepo: Repository<NG_KYC_VIN>,
    private saveApiService: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(body: VinLookupDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { vin, state, last_name } = body;
    const { charges, business_id } = middlewareInfo;

    try {
      const does_vin_exist = await this.vinRepo.findOne({ where: { vin } });
      if (does_vin_exist) {
        this.saveApiService.execute('VIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return does_vin_exist;
      }
      const data = await this.getVin({ vin, state, last_name });
      if (data?.response_code !== '00') {
        this.saveApiService.execute('VIN LOOKUP', business_id, 'Failed', 0, 'Api');
        return data?.message;
      }
      this.saveApiService.execute('VIN LOOKUP', business_id, 'Successful', charges, 'Api');
      const vinData = await this.vinRepo.save(data.vc_data);
      return vinData;
    } catch (error) {
      this.logger.error(`Error occured while fetching data from vin lookup service: ${error}`);
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  async getVin({ vin, state, last_name }: any) {
    try {
      const { data } = await axios.post(
        `https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/voters_card`,
        { number: vin, state, last_name },
        {
          headers: {
            'x-api-key': IDENTITYPASSSECRETKEY,
            'app-id': IDENTITYPASSAPPID,
          },
        },
      );
      return data;
    } catch (err: any) {
      this.logger.error(err);
      this.logger.error('vin issues');
      return err?.response?.data;
    }
  }
}
