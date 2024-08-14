import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardGetAccountsService {
  private readonly logger = new Logger(DashboardGetAccountsService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(business_id: string, public_key: string) {
    try {
      const accounts = await this.accountRepo.find({ where: { public_key, business_id } });

      const accountWithSameBvn = accounts.reduce((acc, curr) => {
        const { bvn } = curr;
        if (!acc[bvn]) {
          acc[bvn] = [curr];
        } else {
          acc[bvn].push(curr);
        }
        return acc;
      }, {} as any);

      const keys = Object.keys(accountWithSameBvn);
      const formattedAccount = keys.map((_, index) => accountWithSameBvn[keys[index]]);
      return formattedAccount;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
