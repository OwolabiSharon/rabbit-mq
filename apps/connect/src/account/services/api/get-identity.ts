import { CustomerAccount } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { SaveApiCallService } from '../save-api-call';

@Injectable()
export class ApiGetIdentityService {
  private readonly logger = new Logger(ApiGetIdentityService.name);

  constructor(private readonly saveApiCall: SaveApiCallService) {}

  async execute(middlewareInfo: any) {
    try {
      const { account, charges, private_key } = middlewareInfo;

      await this.saveApiCall.execute({
        endpoint: 'Gets an entity identity',
        private_key,
        business_id: account.business_id,
        status: 'success',
        amount: charges,
        source: 'Api',
      });

      return await this.preparedIdentity(account);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async preparedIdentity(account: CustomerAccount) {
    const data = {
      fullName: account.full_name,
      email: account?.email,
      phone: account?.phone_number || '',
      gender: account?.gender || '',
      dob: account?.dob || '',
      bvn: account?.bvn || '',
      maritalStatus: account?.marital_status || '',
    };

    return data;
  }
}
