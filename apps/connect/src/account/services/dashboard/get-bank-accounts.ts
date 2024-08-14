import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardGetAccountsBankService {
  private readonly logger = new Logger(DashboardGetAccountsBankService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(public_key: string, business_id: string) {
    try {
      const account = await this.accountRepo.find({ where: { public_key, business_id } });
      return account;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
