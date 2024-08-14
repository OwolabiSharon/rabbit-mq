import { getPaginatedData, ReadStatement } from '@app/common';
import { BankStatementProps } from '@app/common/utils/banks/interface';
import { Injectable, Logger } from '@nestjs/common';
import { SaveApiCallService } from 'apps/connect/src/account/services/save-api-call';

@Injectable()
export class ApiGetTransactionService {
  private readonly logger = new Logger(ApiGetTransactionService.name);
  constructor(private readonly saveApiCall: SaveApiCallService) {}

  async execute(middlewareInfo: any, query: any) {
    try {
      const { account, private_key, charges } = middlewareInfo;
      const { start, end, narration, type, paginate, page, limits } = query;
      const jsArrayObject = await ReadStatement(account._id);
      if (jsArrayObject.length > 0) {
        let newArray: any = jsArrayObject.map((item: BankStatementProps) => ({
          type: item.type === 'D' ? 'debit' : 'credit',
          amount: item.amount,
          narration: item.narration,
          date: item.date,
          closingBalance: item.closingBalance,
          tranId: item.tranId,
        }));

        // if start and end is passed in query
        if (start && end) {
          const startDate = new Date(String(start));
          const endDate = new Date(String(end));

          newArray = newArray.filter((item: BankStatementProps) => {
            const date = new Date(item.date);
            return date >= startDate && date <= endDate;
          });
        }

        // check if narration is passed{
        if (narration) {
          newArray = newArray.filter((item: BankStatementProps) =>
            item.narration.includes(String(narration)),
          );
        }

        // if type is either credit or debit
        if (type) {
          newArray = newArray.filter((item: BankStatementProps) => item.type === type);
        }

        await this.saveApiCall.execute({
          endpoint: 'Transaction',
          private_key,
          business_id: account.business_id,
          status: 'success',
          amount: charges,
          source: 'Api',
        });

        // if paginate is false
        if (paginate === 'true') {
          newArray = await getPaginatedData({
            array: newArray,
            currentPage: page ? parseInt(String(page), 10) : 1,
            limits: limits ? parseInt(String(limits), 10) : 10,
          });
          return newArray;
        }
        return newArray;
      }
      return null;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
