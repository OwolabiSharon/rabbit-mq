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
import { RejectBusinessDto } from '../dto/reject-business.dto';

@Injectable()
export class RejectBusinessService {
  private readonly logger = new Logger(RejectBusinessService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(UnVerifiedBusiness)
    private readonly unverifiedBusinessRepo: Repository<UnVerifiedBusiness>,
  ) {}

  async execute(business_id: string, data: RejectBusinessDto) {
    try {
      const business = await this.businessRepo.findOne({
        where: { id: business_id },
      });
      if (!business) {
        throw new BadRequestErrorException('Business not found');
      }

      const business_process = 'rejected';
      const { message } = data;

      await this.businessRepo.update({ id: business_id }, { business_process, message });

      await this.unverifiedBusinessRepo.update({ business_id }, { is_archived: true, message });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
