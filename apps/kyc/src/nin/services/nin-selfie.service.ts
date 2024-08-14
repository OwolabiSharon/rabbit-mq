import { NG_KYC_NIN, RmqService } from '@app/common';
import { SaveApiCallService } from '@app/common/services/saveApiCall/saveApiCall.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { middlewareInfoType } from 'apps/kyc/types';
import { Repository } from 'typeorm';
import { selfieNin } from '../api/nin-selfie.api';
import { NinSelfieQueryDto } from '../dto/nin-selfie.dto';

@Injectable()
export class NinSelfieService {
  private readonly logger = new Logger(NinSelfieService.name);

  constructor(
    @InjectRepository(NG_KYC_NIN)
    private readonly ninRepo: Repository<NG_KYC_NIN>,
    @Inject(SaveApiCallService)
    private saveApiService: SaveApiCallService,
    private rmqService: RmqService,
  ) {}

  async execute(body: NinSelfieQueryDto, middlewareInfo: middlewareInfoType, context: RmqContext) {
    const { nin, selfie_image } = body;
    const { business_id, charges } = middlewareInfo;

    try {
      let doesNinExist = await this.ninRepo.findOne({ where: { nin } });
      const message = await selfieNin(nin, selfie_image);
      if (message?.error) {
        this.saveApiService.execute('SELFIE NIN VERIFICATION', business_id, 'Failed', 0, 'Api');
        return message?.error;
      }
      this.saveApiService.execute(
        'SELFIE NIN VERIFICATION',
        business_id,
        'Successful',
        charges,
        'Api',
      );

      if (!doesNinExist) {
        message.entity.spoken_language = message.entity.nspokenlang;
        message.entity.residence_address = message.entity.residence_AddressLine1;
        doesNinExist = await this.ninRepo.save(message.entity);
        return {
          ninInfo: doesNinExist,
          selfieVerification: message.entity.selfie_verification,
        };
      }
      return {
        ninInfo: doesNinExist,
        selfieVerification: message.entity.selfie_verification,
      };
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
