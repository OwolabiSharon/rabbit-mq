import { ApiCall } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type ApiProps = {
  endpoint: string;
  private_key: string;
  business_id: string;
  status: 'failed' | 'success';
  amount: number;
  source: 'Api' | 'Dashboard';
};

@Injectable()
export class SaveApiCallService {
  private readonly logger = new Logger(SaveApiCallService.name);

  constructor(
    @InjectRepository(ApiCall)
    private readonly apiRepo: Repository<ApiCall>,
  ) {}
  async execute({ endpoint, private_key, business_id, status, amount, source }: ApiProps) {
    const api = await this.apiRepo.save({
      endpoint,
      private_key,
      business_id,
      status,
      amount,
      source,
    });

    // const balance = await Balance.findOne({ orgId });
    // const newBalance = balance!.balance - amount;
    // await Balance.updateOne({ orgId }, { balance: newBalance });

    return api;
  }
}
