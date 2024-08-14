import { AccountLoginDetails, CustomerAccount } from '@app/common/database';
import { ApiProps } from 'apps/connect/src/account/services/save-api-call';
import { LOGIN_SECRET } from 'apps/connect/src/config';
import ZenithHeaders from 'apps/connect/src/zenith/api/headers';
import ZenithSendRequest from 'apps/connect/src/zenith/api/send-request.api';
import { Response } from 'express';
import { decryptAccountPassword, Encrypt } from '../../encryptions';

const AuthFunction = async (
  loginID: string,
  password: string,
  deviceID: string,
  business_id: string,
  private_key: string,
  source: ApiProps['source'],
) => {
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
  const saveApiPayload = {
    endpoint: 'Authorization',
    private_key,
    business_id,
    status: 'failed',
    amount: 0.0,
    source,
  };
  return { readableVersion, saveApiPayload };
};

const ZenithAuthenticate = async (
  account: CustomerAccount,
  res: Response,
  private_key: string,
  source: ApiProps['source'],
  login_details: AccountLoginDetails,
) => {
  const { device_id } = account;
  const { login_id } = account.login_details;
  const password = decryptAccountPassword(account.login_details.password, LOGIN_SECRET);
  const { readableVersion, saveApiPayload } = await AuthFunction(
    login_id,
    password,
    device_id,
    account.business_id,
    private_key,
    source,
  );

  return { readableVersion, saveApiPayload };
};

export default ZenithAuthenticate;
