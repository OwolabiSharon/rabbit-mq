import { NG_KYC_BVN_ADVANCE, RmqService, SaveApiCallService } from '@app/common';
import { NG_KYC_BVN_BASIC } from '@app/common/database/models/ng_kyc_models/ng_kyc_bvn_basic';
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
export class BvnLoookupAdvanceService {
  private readonly logger = new Logger(BvnLoookupAdvanceService.name);

  constructor(
    @InjectRepository(NG_KYC_BVN_ADVANCE) private readonly bvnRepo: Repository<NG_KYC_BVN_ADVANCE>,
    private readonly rmqService: RmqService,
    @InjectRepository(NG_KYC_BVN_BASIC) private readonly bvnBasicRepo: Repository<NG_KYC_BVN_BASIC>,
    @Inject(SaveApiCallService) private readonly saveApiCall: SaveApiCallService,
  ) {}

  async execute(bvn: string, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { business_id, charges } = middlewareInfo;
    if (!bvn) throw new BadRequestException('please pass in a valid bvn');

    try {
      const doesBvnExist = await this.bvnRepo.findOne({ where: { bvn } });
      if (doesBvnExist) {
        this.saveApiCall.execute('BVN ADVANCE LOOKUP', business_id, 'Successful', charges, 'Api');
        return doesBvnExist;
      }
      const data = await this.getBvn(
        bvn,
        'https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/bvn',
      );

      if (data?.response_code !== '00') {
        this.saveApiCall.execute('BVN ADVANCE LOOKUP', business_id, 'Failed', 0, 'Api');
        throw new UnprocessableEntityException(data?.message);
      }
      this.saveApiCall.execute('BVN ADVANCE LOOKUP', business_id, 'Successful', charges, 'Api');
      await this.bvnBasicRepo.save(data.bvn_data);
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
