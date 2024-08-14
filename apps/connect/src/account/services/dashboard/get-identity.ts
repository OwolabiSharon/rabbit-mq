import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const _ = require('lodash');

@Injectable()
export class DashboardGetIdentityService {
  private readonly logger = new Logger(DashboardGetIdentityService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(id: string) {
    try {
      const account = await this.accountRepo.findOne({ where: { id } });
      const identity = _.omit(account, [
        'session_id',
        'session_exp',
        'transaction_history_file_path',
        'device_id',
      ]);
      return identity;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
