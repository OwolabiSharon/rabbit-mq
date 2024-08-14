import { CustomerAccount, RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { GenerateFcmbStatement } from './generate-statement';

@Injectable()
export class RegenerateFcmbStatement {
  private readonly logger = new Logger(RegenerateFcmbStatement.name);
  constructor(
    private readonly generateFcmbStatement: GenerateFcmbStatement,
    private readonly rmqService: RmqService,
  ) {}

  async execute(account: CustomerAccount, context: RmqContext) {
    try {
      await this.generateFcmbStatement.execute(account);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
