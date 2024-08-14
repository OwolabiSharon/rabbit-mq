import {
  App,
  ConflictErrorException,
  CustomerAccount,
  NotFoundErrorException,
  StatementPage,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatementPageDto } from '../dto/statementPage.dto';

@Injectable()
export class CreateStatmentPageService {
  private readonly logger = new Logger(CreateStatmentPageService.name);
  constructor(
    @InjectRepository(StatementPage)
    private readonly statementRepo: Repository<StatementPage>,
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute(business_id: string, data: StatementPageDto) {
    try {
      const payload = await new StatementPageDto().toEntity(data);
      const exists = await this.statementRepo.findOne({ where: { app_id: payload.app_id } });

      if (exists) {
        throw new ConflictErrorException('App already exists');
      }

      const app = await this.appRepo.findOne({ where: { id: payload.app_id } });

      if (!app) {
        throw new NotFoundErrorException('App not found');
      }

      const no_of_account = await this.accountRepo.count({ where: { public_key: app.public_key } });

      payload.business_id = business_id;
      payload.no_of_account = no_of_account;

      const statement = await this.statementRepo.save(payload);

      return statement;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
