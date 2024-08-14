import { UnVerifiedBusiness } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetUnverifiedBusinessService {
  private readonly logger = new Logger(GetUnverifiedBusinessService.name);
  constructor(
    @InjectRepository(UnVerifiedBusiness)
    private readonly businessRepo: Repository<UnVerifiedBusiness>,
  ) {}

  async execute(business_id: string) {
    try {
      const business = await this.businessRepo.findOne({
        where: { business_id, is_archived: false, is_verified: false },
        relations: ['user'],
      });
      return business;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
