import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { SaveApiCallService } from '../save-api-call';

@Injectable()
export class ApiGetAccountsService {
  private readonly logger = new Logger(ApiGetAccountsService.name);

  constructor(private readonly saveApiCall: SaveApiCallService) {}

  async execute(middlewareInfo: any) {
    try {
      const { account, charges, private_key } = middlewareInfo;

      const accounts = account.map((account: CustomerAccount) => ({
        accountId: account.id,
        fullName: account.full_name,
        userReference: account.user_reference,
      }));

      await this.saveApiCall.execute({
        endpoint: 'Gets Account Lists',
        private_key,
        business_id: accounts[0].business_id,
        status: 'success',
        amount: charges,
        source: 'Api',
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
