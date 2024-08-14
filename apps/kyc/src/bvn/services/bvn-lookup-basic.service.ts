import { SaveApiCallService, NG_KYC_BVN_BASIC, RmqService } from '@app/common';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { IDENTITYPASSAPPID, IDENTITYPASSSECRETKEY } from 'apps/kyc/config';
import { middlewareInfoType } from 'apps/kyc/types';
import axios from 'axios';
import { Repository } from 'typeorm';

@Injectable()
export class BvnLoookupBasicService {
  private readonly logger = new Logger(BvnLoookupBasicService.name);

  constructor(
    @InjectRepository(NG_KYC_BVN_BASIC) private readonly bvnRepo: Repository<NG_KYC_BVN_BASIC>,
    private rmqService: RmqService,
    @Inject(SaveApiCallService) private readonly saveApiCall: SaveApiCallService,
  ) {}

  async execute(bvn: string, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { business_id, charges } = middlewareInfo;
    if (!bvn) throw new BadRequestException('please pass in a valid bvn');

    try {
      const doesBvnExist = await this.bvnRepo.findOne({ where: { bvn } });
      if (doesBvnExist) {
        this.saveApiCall.execute('BVN BASIC LOOKUP', business_id, 'Successful', charges, 'Api');
        return doesBvnExist;
      }

      const data = await this.getBvn(
        bvn,
        'https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/bvn_validation',
      );

      if (data?.response_code !== '00') {
        this.saveApiCall.execute('BVN BASIC LOOKUP', business_id, 'Failed', charges, 'Api');
        throw new UnprocessableEntityException(data?.message);
      }
      this.saveApiCall.execute('BVN BASIC LOOKUP', business_id, 'Successful', charges, 'Api');
      data.bvn_data.bvn = bvn;
      data.bvn_data.phoneNumber1 = data.bvn_data.phoneNumber;
      return this.bvnRepo.save(data.bvn_data);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  async getBvn(bvn: string, url: string) {
    try {
      const { data } = await axios.post(
        url,
        {
          number: bvn,
        },
        {
          headers: {
            'x-api-key': IDENTITYPASSSECRETKEY,
            'app-id': IDENTITYPASSAPPID,
          },
        },
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
}
