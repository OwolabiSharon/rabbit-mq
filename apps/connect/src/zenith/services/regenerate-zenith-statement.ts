import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { GenerateZenithStatementService } from './zenith-generate-statement';

@Injectable()
export class RegenerateZenithStatement {
  private readonly logger = new Logger(RegenerateZenithStatement.name);
  constructor(private readonly generateZenithStatement: GenerateZenithStatementService) {}

  async execute(account: CustomerAccount) {
    try {
      await this.generateZenithStatement.execute(account, '123');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
