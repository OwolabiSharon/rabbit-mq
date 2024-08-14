import * as fs from 'fs';
import * as path from 'path';
import { fork } from 'child_process';
import { CronJob, CronTime } from 'cron';
import { Injectable, Logger } from '@nestjs/common';
import ExecShellCommand from '@app/common/utils/banks/exec-shell-command';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAccount } from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class GenerateFcmbStatement {
  private readonly logger = new Logger(GenerateFcmbStatement.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  startCron(job: any) {
    console.log(job);
    job.start();
    this.logger.log('cron job started');
    setTimeout(() => {
      job.setTime(new CronTime('0 23 * * *'));
      job.stop();
    }, 1000);
  }

  async execute(account: any) {
    try {
      const job = await this.cronJob(account);
      console.log(job);
      this.startCron(job);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cronJob(account: any) {
    try {
      const job = new CronJob('* * * * * *', async () => {
        const today = new Date();
        const lastYear = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate(),
        ).getTime();
        const childProcess = fork(path.join(__dirname, './GenerateStatementChild'));
        childProcess.send({ account, lastYear });
        childProcess.on('message', async (response: any) => {
          const statementReturned: any = await ExecShellCommand(
            `java Aes_DF ${__dirname}/${account.customerAccountId}-statement.txt`,
          );
          const filePath = path.join(__dirname, `${account.customerAccountId}-statement.txt`);

          fs.unlink(filePath, (err) => console.log(err));

          const formattedStatementReturned = JSON.parse(statementReturned);

          if (!formattedStatementReturned?.result?.content) {
            this.logger.error(
              `Error generating GTB Statement: ${formattedStatementReturned?.result}`,
            );
            return;
          }

          const formattedStatement = formattedStatementReturned.result.content.map((item: any) => ({
            type: item.type === 'CREDIT' ? 'C' : 'D',
            date: new Date(item.transactionDate),
            narration: item.narration,
            amount: parseFloat(item?.amount),
            tranId: item.transactionId,
            closingBalance: parseFloat(item.runningBalance),
          }));

          const readableDirectory = path.join(__dirname, '../../public/statements');
          if (!fs.existsSync(readableDirectory)) {
            fs.mkdirSync(readableDirectory);
          }

          // construct a filePath
          const filePathStatement = path.join(
            __dirname,
            `.../../public/statements/${account._id}.json`,
          );
          fs.writeFile(filePathStatement, JSON.stringify(formattedStatement), (err) => {
            if (err) {
              this.logger.error(`Error writing FCMB statement to file: ${err}`);
            }
          });

          // update the customer filePath
          await this.accountRepo.update(
            { id: account.id },
            {
              transaction_history_file_path: filePathStatement,
              statement_date: new Date(Date.now()),
              statement_length: formattedStatement.length,
              isCompleted: true,
            },
          );
        });
      });
      return job;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
