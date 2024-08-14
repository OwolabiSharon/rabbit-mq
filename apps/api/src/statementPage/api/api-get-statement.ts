import { BadRequestErrorException, ReadStatement, StatementPage } from '@app/common';
import { BankStatementProps } from '@app/common/utils/banks/interface';
import { Injectable, Logger } from '@nestjs/common';
import { SaveApiCallService } from 'apps/connect/src/account/services/save-api-call';
import * as moment from 'moment';

@Injectable()
export class ApiGetStatement {
  private readonly logger = new Logger(ApiGetStatement.name);
  constructor(private readonly saveApiCall: SaveApiCallService) {}

  async execute(middlewareInfo: any, period: string) {
    try {
      const { account, private_key, charges } = middlewareInfo;
      if (
        period &&
        (parseInt(period, 10) < 1 || parseInt(period, 10) > 12 || period.match(/[a-z]/i))
      ) {
        throw new BadRequestErrorException('period must be between 1 and 12');
      }

      if (!period) period = '1';
      const jsArrayObject = await ReadStatement(account.id);
      if (jsArrayObject.length > 0) {
        const lastArray = jsArrayObject?.slice(-1)[0];
        const lastArrayDate = new Date(lastArray?.date);
        const periodAgo = new Date(
          lastArrayDate?.setMonth(lastArrayDate?.getMonth() - parseInt(period, 10)),
        );

        // map and return onnly the narration and type properties
        const statementArray = jsArrayObject
          .map((item: BankStatementProps) => ({
            type: item.type === 'D' ? 'debit' : 'credit',
            amount: item?.amount,
            narration: item?.narration,
            date: item?.date,
            closingBalance: item?.closingBalance,
            tranId: item?.tranId,
          }))
          .filter((items: BankStatementProps) => moment(items?.date).isAfter(periodAgo));

        await this.saveApiCall.execute({
          endpoint: 'Get Statement',
          private_key,
          business_id: account.business_id,
          status: 'success',
          amount: charges,
          source: 'Api',
        });

        const objTosend = {
          meta: { count: statementArray.length },
          data: statementArray,
        };
        return objTosend;
      }
      return { meta: { count: 0 } };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
