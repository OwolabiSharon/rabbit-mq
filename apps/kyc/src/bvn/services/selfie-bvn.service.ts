import { NG_KYC_BVN_ADVANCE, NG_KYC_BVN_BASIC, RmqService, SaveApiCallService } from '@app/common';

import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DOJAHAUTHORIZATION, DOJAHAPPID } from 'apps/kyc/config';
import { middlewareInfoType } from 'apps/kyc/types';
import axios from 'axios';
import { Repository } from 'typeorm';
import { SelfieBvnQueryDto } from '../dto/selfie-bvn.dto';

@Injectable()
export class SelfieBvnService {
  private readonly logger = new Logger(SelfieBvnService.name);

  constructor(
    @InjectRepository(NG_KYC_BVN_ADVANCE) private readonly bvnRepo: Repository<NG_KYC_BVN_ADVANCE>,

    @InjectRepository(NG_KYC_BVN_BASIC) private readonly bvnBasicRepo: Repository<NG_KYC_BVN_BASIC>,
    @Inject(SaveApiCallService) private readonly saveApiCall: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(body: SelfieBvnQueryDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { bvn, selfie_image } = body;
    const { business_id, charges } = middlewareInfo;

    try {
      let doesBvnExist = await this.bvnRepo.findOne({ where: { bvn } });
      const message = await this.getBvn(bvn, selfie_image);
      if (message.error) {
        this.saveApiCall.execute('BVN ADVANCE LOOKUP', business_id, 'Failed', 0, 'Api');
        throw new UnprocessableEntityException(message?.error);
      }
      this.saveApiCall.execute(
        'SELFIE BVN VERIFICATION',
        business_id,
        'Successful',
        charges,
        'Api',
      );
      if (!doesBvnExist) {
        await this.bvnRepo.save(this.formatBVN(message?.entity));
        doesBvnExist = await this.bvnBasicRepo.save(this.formatBVN(message?.entity));
        return { bvnInfo: doesBvnExist, selfieBvnResponse: message.entity.selfie_verification };
      }
      return { bvnInfo: doesBvnExist, selfieBvnResponse: message.entity.selfie_verification };
    } catch (error) {
      this.logger.error(`Error encountered when fetching selfie bvn. ${error}`);
      this.rmqService.ack(context);
      throw error;
    }
  }

  formatBVN(details: any) {
    return {
      bvn: details.bvn,
      firstName: details.first_name,
      middleName: details.middle_name,
      lastName: details.last_name,
      gender: details.gender,
      dateOfBirth: details.date_of_birth,
      base64Image: details.image,
      email: details.email,
      phoneNumber1: details.phone_number1,
      enrollmentBank: details.enrollment_bank,
      registrationDate: details.registration_date,
      enrollmentBranch: details.enrollment_branch,
      levelOfAccount: details.level_of_account,
      lgaOfOrigin: details.lga_of_origin,
      lgaOfResidence: details.Ido,
      maritalStatus: details.marital_status,
      nin: details.nin,
      nameOnCard: details.name_on_card,
      nationality: details.nationality,
      phoneNumber2: details.phone_number2,
      residentialAddress: details.residential_address,
      stateOfOrigin: details.state_of_origin,
      stateOfResidence: details.state_of_residence,
      title: details.title,
      watchListed: details.watch_listed,
    };
  }

  async getBvn(bvn: string, selfie_image: string) {
    try {
      const { data } = await axios.post(
        'https://api.dojah.io/api/v1/kyc/bvn/verify',
        { bvn, selfie_image },
        {
          headers: {
            Authorization: DOJAHAUTHORIZATION,
            AppId: DOJAHAPPID,
          },
        },
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
}
