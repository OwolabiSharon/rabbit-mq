import { AccountLoginDetails, CustomerAccount } from '@app/common/database';
import { ApiProps } from 'apps/connect/src/account/services/save-api-call';
import { LOGIN_SECRET } from 'apps/connect/src/config';
import { GetReturnedFcmbRawValue } from 'apps/connect/src/fcmb/functions';
import axios from 'axios';
import { Response } from 'express';
import { decryptAccountPassword } from '../../encryptions';
import { JavaConstants } from '../enums';
import ExecShellCommand from '../exec-shell-command';

const FcmbAuthenticate = async (
  account: CustomerAccount,
  res: Response,
  private_key: string,
  source: ApiProps['source'],
  login_details: AccountLoginDetails,
) => {
  const { device_id } = account;
  const { login_id, password } = login_details;

  const message = `${
    JavaConstants.Encrypt
  } '{"authenticationType":"PASSWORD","businessProfile":false,"deviceId":"${device_id}","deviceName":"Genymotion","deviceType":"vbox86p","fingerprintKey":"","isNewAcctOpening":false,"password":"${decryptAccountPassword(
    password,
    LOGIN_SECRET,
  )}","phoneType":"ANDROID","pin":"","username":"${login_id}","version":"1.9.93"}'`;

  const encrypted: any = await ExecShellCommand(message);
  const splitedString = encrypted.split('\n');
  const body = splitedString[0];
  const secretKey = splitedString[1];

  const response = await axios.post(
    'https://mobileappserver.fcmb.com/moneytor-service/api/v1/fcmb/login',
    {
      body: `"${body}\r"`,
      secretKey: `"${secretKey}\r"`,
    },
    {
      headers: {
        Host: 'mobileappserver.fcmb.com',
        Deviceid: device_id,
        'Client-Id': '3MNT0001',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/4.9.3',
        Connection: 'close',
      },
    },
  );

  const formattedData = await GetReturnedFcmbRawValue(response.data);

  return formattedData

};

export default FcmbAuthenticate;
