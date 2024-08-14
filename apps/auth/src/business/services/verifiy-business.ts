import {
  BadRequestErrorException,
  Business,
  BusinessRolesEntity,
  UnVerifiedBusiness,
  User,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VerifyBusinessService {
  private readonly logger = new Logger(VerifyBusinessService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(UnVerifiedBusiness)
    private readonly unverifiedBusinessRepo: Repository<UnVerifiedBusiness>,
  ) {}

  async execute(business_id: string) {
    try {
      const business = await this.businessRepo.findOne({
        where: { id: business_id },
      });
      if (!business) {
        throw new BadRequestErrorException('Business not found');
      }

      const business_process = 'verified';
      const message = 'Business has been verified';
      const is_business_verified = true;
      const verified_date = new Date();

      await this.businessRepo.update(
        { id: business_id },
        { business_process, message, is_business_verified, verified_date },
      );

      await this.unverifiedBusinessRepo.update({ business_id }, { is_verified: true, message });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
