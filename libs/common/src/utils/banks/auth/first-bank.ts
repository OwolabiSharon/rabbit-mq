import { AccountLoginDetails, CustomerAccount } from '@app/common/database';
import { ApiProps } from 'apps/connect/src/account/services/save-api-call';
import { FirstBankSendRequest } from 'apps/connect/src/firstBank/api/firstbank-fetch';
import FirstBankHeaders from 'apps/connect/src/firstBank/api/headers';
import { Response } from 'express';
import { decryptAccountPassword, Encrypt } from '../../encryptions';

const FirstBankAuthenticate = async (
  account: CustomerAccount,
  res: Response,
  private_key: string,
  source: ApiProps['source'],
  login_details: AccountLoginDetails,
): Promise<any> => {
  const message = JSON.stringify({
    deviceID: login_details?.login_id,
    pin: decryptAccountPassword(login_details!.password!, process.env.LOGIN_SECRET!),
    pushToken: '1111',
    appVersion: '2.7.0',
  });
  const encryptedData = await Encrypt(message, account.device_id!);
  const firstBankHeader = FirstBankHeaders(account?.device_id!, null, 128);
  firstBankHeader.Customtype = true;
  firstBankHeader.Connection = 'close';

  const readableAccountDetails = await FirstBankSendRequest(
    'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/user/authenticate',
    encryptedData,
    firstBankHeader,
    account.device_id,
  );

  const saveApiPayload = {
    endpoint: 'Authorization',
    private_key,
    business_id: account.business_id!,
    status: 'failed',
    amount: 0.0,
    source,
  };
  return { readableAccountDetails, saveApiPayload };
};

export default FirstBankAuthenticate;
