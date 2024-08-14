import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const _ = require('lodash');

@Injectable()
export class GetTransactionsPageService {
  private readonly logger = new Logger(GetTransactionsPageService.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute(business_id: string, public_key: string) {
    try {
      const account = await this.accountRepo.find({ where: { public_key, business_id } });
      return account;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
