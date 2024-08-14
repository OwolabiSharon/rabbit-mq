import { CustomerAccount } from '@app/common';
import { BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type DuplicateProps = {
  account_no: string;
  business_id: string;
  public_key: string;
};

export class CheckForDuplicateAccountService {
  private readonly logger = new Logger(CheckForDuplicateAccountService.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute({ account_no, business_id, public_key }: DuplicateProps): Promise<boolean> {
    try {
      const isDuplicate = await this.accountRepo.findOne({
        where: { account_no, business_id, public_key },
      });
      if (isDuplicate) {
        await this.accountRepo.delete({ id: isDuplicate.id });
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
