import { Business, User } from '@app/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class getProfilePercentService {
  private readonly logger = new Logger(getProfilePercentService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async execute(business_id: string) {
    try {
      const totalCount = 4;
      let registration = 1;

      const business = await this.businessRepo.findOne({
        where: {
          id: business_id,
        },
        relations: ['app']
      });
      if (!business) throw new NotFoundException('Business not found');

      //has this business been verified?
      if (business.name && business.registration_address && business.registration_number) registration += 1;

      //has any app been created for this business
      if (business.app.length > 0) registration += 1;

      // if any balance has ever been made
      if (business.is_balance_funded) registration += 1;

      return (registration / totalCount) * 100;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
