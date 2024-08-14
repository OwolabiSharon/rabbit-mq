import { CustomerAccount, RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { GenerateAccessStatement } from './generate-statement';

@Injectable()
export class RegenerateAccessStatement {
  private readonly logger = new Logger(RegenerateAccessStatement.name);
  constructor(
    private readonly generateAccessStatement: GenerateAccessStatement,
    private readonly rmqService: RmqService,
  ) {}

  async execute(account: CustomerAccount, context: RmqContext) {
    try {
      await this.generateAccessStatement.execute(account, context);
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
