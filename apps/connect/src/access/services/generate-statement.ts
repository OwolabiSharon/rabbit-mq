import { CustomerAccount, RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronJob, CronTime } from 'cron';
import { parseStringPromise } from 'xml2js';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import { generateAccessStatemntApi } from '../api/generate-access-statement.api';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class GenerateAccessStatement {
  private readonly logger = new Logger(GenerateAccessStatement.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly rmqService: RmqService,
  ) {}

  async execute(account: any, context: RmqContext) {
    const job = await this.cronJob(account, context);
    this.startCron(job, context);
    return true;
  }

  startCron(job: any, context: RmqContext) {
    job.start();
    this.logger.log('cron job started');
    this.rmqService.ack(context);
    setTimeout(() => {
      job.setTime(new CronTime('0 23 * * *'));
      job.stop();
    }, 1000);
  }

  formatAcessDate(date: any) {
    const split = date.substring(0, 10).split('/');
    const year = split[2];
    const month = split[1];
    const day = split[0];
    return `${year}-${month}-${day}`;
  }

  async cronJob(account: any, context: RmqContext) {
    try {
      const job = new CronJob('* * * * * *', async () => {
        const today = moment().format('DD/MM/YYYY');
        const lastYear = moment().subtract(1, 'year').format('DD/MM/YYYY');

        const params: any = new URLSearchParams();
        params.append('filterlabelids', '');
        params.append('fromvaluedate', lastYear);
        params.append('tovaluedate', today);
        params.append('currency', 'NGN');
        params.append('accountid_history', account.accessId);
        params.append('sortorderlist', '0,1,1,1');
        params.append('sortbylist', '2,-1,-1,-1');
        params.append('frompostingdate', '');
        params.append('topostingdate', '');
        params.append('fromamount', '');
        params.append('toamount', '');
        params.append('txntype', '');
        params.append('narrativesubstring', '');
        params.append('generictext', '');
        params.append('genericamountfrom', '');
        params.append('genericamountto', '');
        params.append('genericdatefrom', '');
        params.append('genericdateto', '');
        params.append('recordsperscreen', 1000);
        params.append('maxrecordmatches', 10000);
        params.append('reconsflag', true);
        params.append('unreconsflag', true);
        params.append('statusfilter', '-60,0,-100');
        params.append('transactiontemplateid', '');
        params.append('transactiontemplatename', '');
        params.append(
          `${account?.csrfToken?.split('=')[0]}`,
          `${account?.csrfToken!.split('=')[1]}`,
        );

        const accessStatementResponse = await generateAccessStatemntApi(
          account.sessionId,
          account.BwInstance,
          params,
        );

        console.log(accessStatementResponse);

        if (accessStatementResponse?.resonse?.error?.length > 0) {
          this.logger.error(
            `Access Statement, Caused by: ${accessStatementResponse?.resonse?.error[0]}`,
          );
          return;
        }

        if (accessStatementResponse?.script?.portal_web_rejected) {
          this.logger.error(
            `Error generating Access statement: ${accessStatementResponse?.script?.portal_web_rejected}`,
          );
          return;
        }

        const accessStatement = accessStatementResponse?.resonse?.model || [];

        const formattedStatement = accessStatement?.reverse()?.map((transaction: any) => ({
          type: transaction?.txnType[0] === '1486' ? 'D' : 'C',
          date: this.formatAcessDate(transaction?.date[0]),
          narration: transaction?.narrative[0],
          amount: parseFloat(transaction?.rawbalance[0]),
          closingBalance: 0,
          tranId: transaction?.hosttransactionref[0],
        }));

        const readableDirectory = path.join(__dirname, '../../public/statements');
        if (!fs.existsSync(readableDirectory)) {
          fs.mkdirSync(readableDirectory);
        }
        const filePath = path.join(__dirname, `../../public/statements/${account._id}.json`);
        fs.writeFile(filePath, JSON.stringify(formattedStatement), (err) => {
          if (err) {
            this.logger.error(`Error writing successful Access statement to file: ${err}`);
          }
        });

        await this.accountRepo.update(
          { id: account.id },
          {
            transaction_history_file_path: filePath,
            statement_date: new Date(Date.now()),
            statement_length: formattedStatement.length,
            isCompleted: true,
          },
        );
      });
      return job;
    } catch (error) {
      this.logger.error('Error generating Access statement: ', error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
