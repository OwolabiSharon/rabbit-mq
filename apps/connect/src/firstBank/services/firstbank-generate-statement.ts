import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronJob, CronTime } from 'cron';
import * as fs from 'fs';
import * as path from 'path';
import { fork } from 'child_process';
import { BankStatementProps } from '@app/common/utils/banks/interface';
import { firstBankGenerateStatementChild } from '../api/firstbank-child.api';

@Injectable()
export class GenerateFirstBankStatement {
  private readonly logger = new Logger(GenerateFirstBankStatement.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  startCron(job: any) {
    job.start();
    this.logger.log('cron job started');
    setTimeout(() => {
      job.setTime(new CronTime('0 23 * * *'));
      job.stop();
    }, 1000);
  }

  async execute(account: CustomerAccount, arr: Date[]) {
    try {
      const job = await this.cronJob(account, arr);
      this.startCron(job);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cronJob(account: CustomerAccount, arr: Date[]) {
    try {
      const job = new CronJob('* * * * * *', async () => {
        const accountId = account.id;

        const statementDirectory = path.join(__dirname, '../../public/statements');
        if (!fs.existsSync(statementDirectory)) {
          fs.mkdirSync(statementDirectory);
        }
        const filePath = path.join(__dirname, `../../public/statements/${accountId}.json`);
        let statementArray = [] as BankStatementProps[];

        const message = await firstBankGenerateStatementChild(account, arr);

        statementArray.push(...message);
        statementArray = statementArray.filter(
          (item, index, currentArray) =>
            currentArray.findIndex((v2) => v2?.tranId === item?.tranId) === index,
        );
        fs.writeFileSync(filePath, JSON.stringify(statementArray));
        const newAccount = await this.accountRepo.findOne({ where: { id: account.id } });

        await this.accountRepo.update(
          { id: account.id },
          {
            transaction_history_file_path: filePath,
            statement_date: new Date(Date.now()),
            statement_length: statementArray.length || 0,
            isCompleted: true,
          },
        );
      });
      return job;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
