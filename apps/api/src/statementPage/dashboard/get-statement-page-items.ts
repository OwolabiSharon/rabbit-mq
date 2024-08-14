import { BadRequestErrorException, CustomerAccount, StatementPage } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { BankStatementProps } from '@app/common/utils/banks/interface';

@Injectable()
export class GetStatmentsPageItemsService {
  private readonly logger = new Logger(GetStatmentsPageItemsService.name);
  constructor(
    @InjectRepository(StatementPage)
    private readonly statementRepo: Repository<StatementPage>,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
  ) {}

  async execute(business_id: string, public_key: string) {
    try {
      const getPeriodStatement = await this.statementRepo.findOne({ where: { business_id } });
      if (!getPeriodStatement) {
        throw new BadRequestErrorException('Please create a statement page');
      }

      const accounts = await this.accountRepo.find({ where: { business_id, public_key } });

      if (!accounts) {
        throw new BadRequestErrorException('No customer found for this statement page');
      }

      const getStatements = await Promise.all(
        accounts.map(async (account, index) => {
          if (account?.transaction_history_file_path) {
            const filePath = path.join(__dirname, `../../public/statements/${account.id}.json`);

            if (fs.existsSync(filePath)) {
              const statementFile = fs.readFileSync(filePath, 'utf8');

              const jsArrayOfObject = JSON.parse(statementFile);

              // get the lastArray of the statement
              const lastArray = jsArrayOfObject?.slice(-1)[0];

              // get the date of the lastArray
              const lastArrayDate = lastArray?.date || new Date();

              // get  months ago from lastArrayDate
              const monthsAgo = new Date(
                new Date(lastArrayDate).setMonth(
                  new Date(lastArrayDate).getMonth() -
                    parseInt(getPeriodStatement?.period.split('')[0], 10),
                ),
              );

              // get the array between monthsAgo and lastArrayDate
              const statementArray: BankStatementProps[] = jsArrayOfObject
                ?.reverse()
                .filter((statement: BankStatementProps) => {
                  const date = new Date(statement?.date);
                  return date >= new Date(monthsAgo) && date <= new Date(lastArrayDate);
                });

              const totalCredit = statementArray.reduce((acc, statement) => {
                if (statement.type === 'C') {
                  return acc + Number(statement?.amount);
                }
                return acc;
              }, 0);

              const totalDebit = statementArray.reduce((acc, statement) => {
                if (statement.type === 'D') {
                  return acc + Number(statement?.amount);
                }
                return acc;
              }, 0);

              return {
                statement: statementArray,
                totalCredit,
                totalDebit,
                email: account.email,
                accountNumber: account.account_no,
                balance: account.balance,
                index,
                period: getPeriodStatement.period,
                fullName: account.full_name,
                startDate: monthsAgo,
                endDate: lastArrayDate,
                phoneNumber: account.phone_number,
                statementDate: account.statement_date,
                bankLogo: account.bank_logo,
                bank_name: account.bank_name,
                accountId: account.id,
              };
            }
            return {
              statement: [],
              totalCredit: 0,
              totalDebit: 0,
              email: account.email,
              accountNumber: account.account_no,
              balance: account.balance,
              index,
              period: getPeriodStatement?.period,
              fullName: account.full_name,
              startDate: null,
              endDate: null,
              phone_no: account?.phone_number,
              statementDate: account?.statement_date,
              bankLogo: account?.bank_logo,
              bankName: account?.bank_name,
              accountId: account?.id,
            };
          }
          return {
            statement: [],
            totalCredit: 0,
            totalDebit: 0,
            email: account.email,
            accountNumber: account.account_no,
            balance: account.balance,
            index,
            period: getPeriodStatement?.period,
            fullName: account.full_name,
            startDate: null,
            endDate: null,
            phone_no: account?.phone_number,
            statementDate: account?.statement_date,
            bankLogo: account?.bank_logo,
            bankName: account?.bank_name,
            accountId: account?.id,
          };
        }),
      );

      return getStatements;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
