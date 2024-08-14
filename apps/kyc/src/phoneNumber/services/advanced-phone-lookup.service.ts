import { NG_KYC_Phone_Advance, RmqService, SaveApiCallService } from '@app/common';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { Repository } from 'typeorm';
import { getPhoneAdvance } from '../api/advanced-phone-lookup.api';
import { AdvancedPhoneLookupQueryDto } from '../dto/advanced-phone-lookup.dto';

@Injectable()
export class AdvancedPhoneLookupService {
  private readonly logger = new Logger(AdvancedPhoneLookupService.name);

  constructor(
    @InjectRepository(NG_KYC_Phone_Advance)
    private readonly phoneAdvance: Repository<NG_KYC_Phone_Advance>,
    @Inject(SaveApiCallService) private readonly saveApiService: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(
    query: AdvancedPhoneLookupQueryDto,
    middlewareInfo: middlewareInfoType,
    context: RmqContext,
  ) {
    const { phoneNo } = query;
    const { business_id, charges } = middlewareInfo;
    if (!phoneNo || phoneNo.toString().length < 10) {
      throw new BadRequestException('please pass in a valid phoneNo');
    }
    try {
      const doesPhoneExistInDatabase = await this.phoneAdvance.findOne({
        where: { phoneNumber: phoneNo },
      });
      if (doesPhoneExistInDatabase) {
        this.saveApiService.execute(
          'PHONE NUMBER ADVANCE LOOKUP',
          business_id,
          'Successful',
          charges,
          'Api',
        );
        return doesPhoneExistInDatabase;
      }
      const data = await getPhoneAdvance({ phoneNo });
      if (data.response_code !== '00') {
        this.saveApiService.execute('PHONE NUMBER ADVANCE LOOKUP', business_id, 'Failed', 0, 'Api');
        const message = data?.message || (data?.details?.number > 0 && data?.details?.number[0]);
        return message;
      }
      this.saveApiService.execute(
        'PHONE NUMBER ADVANCE LOOKUP',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      data.data.phoneNo = phoneNo;
      return await this.phoneAdvance.save(data.data);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
