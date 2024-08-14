import { generateHexValue } from '@app/common';
import { JavaConstants } from '@app/common/utils/banks/enums';
import ExecShellCommand from '@app/common/utils/banks/exec-shell-command';
import axios from 'axios';

export async function fcmbLogin(device_Id: string, password: string, username: string) {
  const deviceId = generateHexValue();
  const message = `${JavaConstants.Encrypt} '{"authenticationType":"PASSWORD","businessProfile":false,"deviceId":"${deviceId}","deviceName":"Genymotion","deviceType":"vbox86p","fingerprintKey":"","isNewAcctOpening":false,"password":"${password}","phoneType":"ANDROID","pin":"","username":"${username}","version":"1.9.93"}'`;
  const encrypted: any = await ExecShellCommand(message);
  const splitedString = encrypted.split('\n');
  const body = splitedString[0];
  const secretKey = splitedString[1];
  try {
    const response = await axios.post(
      'https://mobileappserver.fcmb.com/moneytor-service/api/v1/fcmb/login',
      {
        body: `"${body}\r"`,
        secretKey: `"${secretKey}\r"`,
      },
      {
        headers: {
          Host: 'mobileappserver.fcmb.com',
          Deviceid: deviceId,
          'Client-Id': '3MNT0001',
          'Content-Type': 'application/json',
          'User-Agent': 'okhttp/4.9.3',
          Connection: 'close',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
