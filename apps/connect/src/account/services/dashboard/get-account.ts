import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardGetAccountService {
  private readonly logger = new Logger(DashboardGetAccountService.name);

  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(bvn: string, business_id: string, public_key: string) {
    try {
      let account = await this.accountRepo.find({ where: { bvn, public_key, business_id } });
      if (account.length === 0) {
        account = await this.accountRepo.find({ where: { id: bvn, public_key, business_id } });
      }
      const accountsWithSameBvn = account.reduce((acc, curr) => {
        const { bvn } = curr;
        if (!acc[bvn]) {
          acc[bvn] = [curr];
        } else {
          acc[bvn].push(curr);
        }
        return acc;
      }, {} as any);

      const keys = Object.keys(accountsWithSameBvn);
      const formattedAccount = keys.map((_, index) => accountsWithSameBvn[keys[index]]);
      return formattedAccount;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
