import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { SaveApiCallService } from '../save-api-call';

@Injectable()
export class ApiGetAccountService {
  private readonly logger = new Logger(ApiGetAccountService.name);

  constructor(private readonly saveApiCall: SaveApiCallService) {}

  async execute(middlewareInfo: any) {
    try {
      const { account, charges, private_key } = middlewareInfo;

      await this.saveApiCall.execute({
        endpoint: 'Gets an entity account',
        private_key,
        business_id: account.business_id,
        status: 'success',
        amount: charges,
        source: 'Api',
      });

      return await this.preparedAccountToSend(account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async preparedAccountToSend(account: CustomerAccount) {
    const data = {
      id: account.id,
      institution: {
        name: account.bank_name,
        bankCode: account?.bank_code,
        type: account?.account_type,
      },
      name: account.full_name,
      accountNumber: account.account_no,
      balance: account?.balance,
      userReference: account?.user_reference,
      bvn: account?.bvn?.substring(0, 4),
    };

    return data;
  }
}
