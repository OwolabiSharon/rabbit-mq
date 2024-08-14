import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Encrypt } from '@app/common';
import { ApiProps, SaveApiCallService } from '../../account/services/save-api-call';
import ZenithHeaders from '../api/headers';
import ZenithSendRequest from '../api/send-request.api';

export class ZenithAuthService {
  private readonly logger = new Logger(ZenithAuthService.name);
  constructor(private readonly saveApiCallService: SaveApiCallService) {}

  async execute(
    loginID: string,
    password: string,
    deviceID: string,
    business_id: string,
    private_key: string,
    source: ApiProps['source'],
  ) {
    const message = `"start=&loginID=${loginID}&password=${password}&longitude=undefined&latitude=undefined&deviceID=${deviceID}&deviceModel=Google Pixel 2 XL&end="`;
    const encryptedData = await Encrypt(message, deviceID);
    const headers = ZenithHeaders(deviceID, 192);
    const readableVersion = await ZenithSendRequest(
      'https://zmobile.zenithbank.com/zenith/api/customer/authenticate',
      encryptedData,
      headers,
      deviceID,
      password,
    );
    if (readableVersion.code !== 0) {
      await this.saveApiCallService.execute({
        endpoint: 'Account Sync',
        private_key,
        business_id,
        status: 'failed',
        amount: 0.0,
        source: 'Api',
      });
      throw new InternalServerErrorException(readableVersion?.description);
    }
    return readableVersion;
  }
}
