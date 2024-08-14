import { BadRequestErrorException, Business } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardGetBalanceService {
  private readonly logger = new Logger(DashboardGetBalanceService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async execute(business_id: string) {
    try {
      const business = await this.businessRepo.findOne({ where: { id: business_id } });
      const { balance } = business;
      return balance;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
