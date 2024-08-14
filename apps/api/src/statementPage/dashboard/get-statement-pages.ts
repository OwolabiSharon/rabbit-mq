import { StatementPage } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetStatmentsPageService {
  private readonly logger = new Logger(GetStatmentsPageService.name);
  constructor(
    @InjectRepository(StatementPage)
    private readonly statementRepo: Repository<StatementPage>,
  ) {}

  async execute(business_id: string, app_id: string) {
    try {
      const statement = await this.statementRepo.find({ where: { app_id, business_id } });
      return statement;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
