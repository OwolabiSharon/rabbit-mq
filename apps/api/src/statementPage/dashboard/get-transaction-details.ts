import {
  allTimeArray,
  BadRequestErrorException,
  CustomerAccount,
  filterArray,
  getRangePeriod,
  NotFoundErrorException,
  ReadStatement,
} from '@app/common';
import { BankStatementProps } from '@app/common/utils/banks/interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const _ = require('lodash');

@Injectable()
export class GetTransactionsDetailsService {
  private readonly logger = new Logger(GetTransactionsDetailsService.name);
  constructor(
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute(account_id: string, period: string) {
    try {
      if (!period) {
        throw new BadRequestErrorException('please specify a period');
      }
      const account = await this.accountRepo.findOne({ where: { id: account_id } });
      if (!account) {
        throw new NotFoundErrorException('Account not Found');
      }
      const jsArrayObject = await ReadStatement(account.id);
      let newArray: any = jsArrayObject.map((item: BankStatementProps) => ({
        type: item.type === 'D' ? 'debit' : 'credit',
        amount: item.amount,
        narration: item.narration,
        date: item.date,
        tranId: item.tranId,
      }));

      const startDate = getRangePeriod(period);
      if (period && period.includes('All time')) {
        return this.objectToSend(allTimeArray(newArray), account);
      }
      newArray = filterArray({
        array: newArray,
        startDate: startDate.startDate,
        endDate: new Date(),
      });
      return this.objectToSend(newArray, account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  objectToSend(newArray: any, account: CustomerAccount) {
    return {
      ...newArray,
      _id: account.id,
      bankLogo: account.bank_logo,
      bankName: account.bank_name,
      fullName: account.full_name,
      accountNumber: account.account_no,
      statementDate: account.statement_date,
      publicKey: account.public_key,
    };
  }
}
