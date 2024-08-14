import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardGetAccountBankService {
  private readonly logger = new Logger(DashboardGetAccountBankService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(id: string) {
    try {
      const account = await this.accountRepo.findOne({ where: { id } });
      return account;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
