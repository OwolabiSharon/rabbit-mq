import { CustomerAccount, getDateRange, RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { GenerateFirstBankStatement } from './firstbank-generate-statement';

@Injectable()
export class RegenerateFirstBankStatement {
  private readonly logger = new Logger(RegenerateFirstBankStatement.name);
  constructor(
    private readonly generateFirstBankStatement: GenerateFirstBankStatement,
    private readonly rmqService: RmqService,
  ) {}

  async execute(account: CustomerAccount, context: RmqContext) {
    try {
      const today = new Date();
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

      const dateRange = getDateRange(lastYear, today);
      await this.generateFirstBankStatement.execute(account, dateRange);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
