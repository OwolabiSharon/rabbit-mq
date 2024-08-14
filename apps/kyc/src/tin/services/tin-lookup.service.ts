import { NG_KYC_TIN } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDENTITYPASSAPPID, IDENTITYPASSSECRETKEY } from 'apps/kyc/config';
import { middlewareInfoType } from 'apps/kyc/types';
import axios from 'axios';
import { Repository } from 'typeorm';

@Injectable()
export class TinLookupService {
  private readonly logger = new Logger(TinLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_TIN)
    private readonly tinRepo: Repository<NG_KYC_TIN>,
    @Inject(SaveApiCallService) private saveApiService: SaveApiCallService,
  ) {}

  async execute(tin: string, middlewareInfo: middlewareInfoType) {
    const { business_id, charges } = middlewareInfo;

    if (!tin)
      throw new BadRequestException('Please pass in a valid Tax Identification Number(tin)');

    try {
      const does_tin_exist = await this.tinRepo.findOne({ where: { tin } });
      if (does_tin_exist) {
        this.saveApiService.execute('TIN LOOKUP', business_id, 'Successful', charges, 'Api');
        return does_tin_exist;
      }
      const data = await this.getTin(tin);
      if (data?.response_code !== '00') {
        this.saveApiService.execute('TIN LOOKUP', business_id, 'Failed', 0, 'Api');
        return data?.message;
      }
      this.saveApiService.execute('TIN LOOKUP', business_id, 'Successful', charges, 'Api');
      data.data.tin = tin;
      return await this.tinRepo.save(data.data);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getTin(tin: string) {
    try {
      const { data } = await axios.post(
        `https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/tin`,
        { number: tin, channel: 'TIN' },
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
      return err?.response?.data;
    }
  }
}
