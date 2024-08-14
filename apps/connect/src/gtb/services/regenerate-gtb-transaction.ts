import { CustomerAccount, RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { GenerateGtbTransactionService } from './gtb-generate-transaction';

@Injectable()
export class RegenerateGtbTransaction {
  private readonly logger = new Logger(RegenerateGtbTransaction.name);
  constructor(
    private readonly generateGtbStatement: GenerateGtbTransactionService,
    private readonly rmqService: RmqService,
  ) {}

  async execute(account: CustomerAccount, context: RmqContext) {
    try {
      await this.generateGtbStatement.execute(account);
      return 'success';
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
