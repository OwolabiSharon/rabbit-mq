import { AccountLoginDetails, CustomerAccount } from '@app/common/database';
import { ApiProps } from 'apps/connect/src/account/services/save-api-call';
import { LOGIN_SECRET } from 'apps/connect/src/config';
import { GtAuth } from 'apps/connect/src/gtb/api/gtb-auth.api';
import { Response } from 'express';
import { decryptAccountPassword } from '../../encryptions';

const GTBAuthenticate = async (
  account: CustomerAccount,
  res: Response,
  private_key: string,
  source: ApiProps['source'],
  login_details: AccountLoginDetails,
) => {
  const UserId = login_details.login_id;
  const password = decryptAccountPassword(login_details.password, 'BY82hjhj89JJDJDJD8448JJDJ');
  const { device_id } = account;
  const response = await GtAuth(UserId, password, device_id);

  return response;
};

export default GTBAuthenticate;
