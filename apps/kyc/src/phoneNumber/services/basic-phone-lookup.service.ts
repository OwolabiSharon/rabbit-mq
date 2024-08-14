import {
  NG_KYC_Phone_Basic,
  NG_KYC_Phone_Advance,
  SaveApiCallService,
  RmqService,
} from '@app/common';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { Repository } from 'typeorm';
import { getPhone } from '../api/basic-phone-lookup.api';
import { BasicPhoneLookupQueryDto } from '../dto/basic-phone-lookup.dto';

@Injectable()
export class BasicPhoneLookupService {
  private readonly logger = new Logger(BasicPhoneLookupService.name);
  constructor(
    @InjectRepository(NG_KYC_Phone_Basic)
    private readonly phone_basic_repo: Repository<NG_KYC_Phone_Basic>,
    @InjectRepository(NG_KYC_Phone_Advance)
    private readonly phone_advance_repo: Repository<NG_KYC_Phone_Advance>,
    @Inject(SaveApiCallService) private readonly saveApiService: SaveApiCallService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(
    query: BasicPhoneLookupQueryDto,
    middlewareInfo: middlewareInfoType,
    context: RmqContext,
  ) {
    const { phoneNo } = query;
    const { business_id, charges } = middlewareInfo;

    if (!phoneNo || phoneNo.toString().length < 10) {
      throw new BadRequestException('please pass in a valid phoneNo');
    }

    try {
      let doesPhoneExistInDatabase: any = await this.phone_basic_repo.findOne({
        where: { phoneNumber: phoneNo },
      });
      if (!doesPhoneExistInDatabase) {
        doesPhoneExistInDatabase = await this.phone_advance_repo.findOne({
          where: { phoneNumber: phoneNo },
        });
      }
      if (doesPhoneExistInDatabase) {
        this.saveApiService.execute(
          'PHONE NUMBER BASIC LOOKUP',
          business_id,
          'Successful',
          charges,
          'Api',
        );
        const formattedData = {
          firstname: doesPhoneExistInDatabase.firstname,
          surname: doesPhoneExistInDatabase.surname,
          birthdate: doesPhoneExistInDatabase.birthdate,
          middlename: doesPhoneExistInDatabase.middlename,
          phoneNumber: doesPhoneExistInDatabase.phoneNumber,
        };
        return formattedData;
      }
      const data = await getPhone({ phoneNo });
      if (!data || data.response_code !== '00') {
        this.saveApiService.execute('PHONE NUMBER BASIC LOOKUP', business_id, 'Failed', 0, 'Api');
        const message = data?.message || (data?.details?.number > 0 && data?.details?.number[0]);
        return message;
      }
      this.saveApiService.execute(
        'PHONE NUMBER BASIC LOOKUP',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      data.data.phoneNumber = phoneNo;
      return this.phone_basic_repo.save(this.formatData(data.data));
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }

  formatData(data: any) {
    return { ...data, firstname: data.firstName, birthdate: data.dateOfBirth };
  }
}
