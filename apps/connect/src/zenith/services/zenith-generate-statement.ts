import { CustomerAccount } from '@app/common';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateStatementApi } from '../api/generate-statement.api';

export class GenerateZenithStatementService {
  private readonly logger = new Logger(GenerateZenithStatementService.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}
  async execute(account: CustomerAccount, password: string) {
    const filePath = path.join(__dirname, '../../public/statements');

    const formattedStatement = await GenerateStatementApi(account, password, this.formatZenithDate);

    // update the account filePath
    await this.accountRepo.update(
      { id: account.id },
      {
        // transactionHistoryFilePath: filePath,
        statement_date: new Date(Date.now()),
        statement_length: formattedStatement.length,
        isCompleted: true,
      },
    );

    return formattedStatement;
  }
  formatZenithDate(date: any) {
    const split = date.substring(0, 10).split('/');
    const time = date.split(' ')[1];
    const year = split[2];
    const month = split[1];
    const day = split[0];
    return `${year}-${month}-${day} ${time}`;
  }
}
