import { CustomerAccount, removeWhiteSpace } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronJob, CronTime } from 'cron';
import { GtbEncryptString } from '../functions';
import * as fs from 'fs';
import * as path from 'path';
import { GtbTransactionChild } from '../api/gtb-transaction.api';

@Injectable()
export class GenerateGtbTransactionService {
  private readonly logger = new Logger(GenerateGtbTransactionService.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute(account: CustomerAccount) {
    const job = await this.cronJob(account);
    this.startCron(job);
    return true;
  }

  formatGtDate(date: any) {
    const split = date.split('/');
    const year = split[2];
    const month = split[0];
    const day = split[1];
    return `${year}-${month}-${day}`;
  }

  startCron(job: any) {
    job.start();
    this.logger.log('cron job started');
    setTimeout(() => {
      job.setTime(new CronTime('0 23 * * *'));
      job.stop();
    }, 1000);
  }

  async cronJob(account: CustomerAccount) {
    const job = new CronJob('* * * * * *', async () => {
      console.log('started')
      const SourceAccount = GtbEncryptString(`${account.account_no}`);
      const AuthToken = GtbEncryptString(`${account.session_exp}`);
      const message = await GtbTransactionChild(SourceAccount, AuthToken, account);
      if (message.StatusCode !== 0) {
        this.logger.error(`GTB Stattement failed: ${message.StatusCode} ${message?.Message}`);
        return;
      }
      const parsedResponse = JSON.parse(message.Message);
      const statements = parsedResponse.TRANSACTIONS.TRANSACTION.reverse().map((item: any) => ({
        type: item.TRASTATUS === 'CRE' ? 'C' : 'D',
        date: this.formatGtDate(item.TRADATE),
        narration: removeWhiteSpace(item.REMARKS),
        amount: parseFloat(item.TRAAMT),
        tranId: item.ORIGTRASEQ1,
        closingBalance: parseFloat(item.CURRENTBAL),
      }));

      const readableDirectory = path.join(__dirname, '../../public/statements');
      if (!fs.existsSync(readableDirectory)) {
        fs.mkdirSync(readableDirectory);
      }

      // construct a filePath
      const filePath = path.join(__dirname, `../../public/statements/${account.id}.json`);
      fs.writeFile(filePath, JSON.stringify(statements), (err) => {
        if (err) {
          this.logger.error(`Error writing GTB Statement to file: ${err.message}`);
        }
      });
      // update the customer filePath
      await this.accountRepo.update(
        { id: account.id },
        {
          transaction_history_file_path: filePath,
          statement_date: new Date(Date.now()),
          statement_length: statements.length,
          isCompleted: true,
        },
      );
      return statements;
    });
    return job;
  }
}
