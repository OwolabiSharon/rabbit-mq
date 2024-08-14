import { Response } from 'express';
import axios from 'axios';
import * as moment from 'moment';
import { parseStringPromise } from 'xml2js';
import { AccountLoginDetails, CustomerAccount } from '@app/common/database';
import { ApiProps } from 'apps/connect/src/account/services/save-api-call';
import { decryptAccountPassword } from '../../encryptions';
import { LOGIN_SECRET } from 'apps/connect/src/config';

const AccessAuthenticate = async (
  account: CustomerAccount,
  res: Response,
  private_key: string,
  source: ApiProps['source'],
  login_details: AccountLoginDetails,
): Promise<any> => {
  const decryptedPassword = decryptAccountPassword(login_details.password, 'BY82hjhj89JJDJDJD8448JJDJ');

  console.log(decryptedPassword)

  const params = new URLSearchParams();
  params.append('username', login_details.login_id);
  params.append('userpassphrase', decryptedPassword);
  params.append('ipaddress', 1 as any);
  params.append(
    'BOS_GENERIC_TOKEN',
    `<GenericToken><timestamp>${moment().format(
      'YYYY-MM-DD+HH:mm:ss.303',
    )}</timestamp><cookie>2.157615518.1647082195</cookie><UAS>Mozilla/5.0+(X11;+Linux+x86_64;+rv:96.0)+Gecko/20100101+Firefox/96.0</UAS><authenticated>0</authenticated><UserLoginID></UserLoginID><action>4</action><applicationID>ACCESSONLINE</applicationID><transactionType>LOGIN</transactionType></GenericToken>`,
  );

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await axios.post(
    'https://ibank.accessbankplc.com/RetailBank/bml/authentication/login_loginnocert.bml',
    params,
    config,
  );
  const parsedString = await parseStringPromise(response.data);

  const saveApiPayload = {
    endpoint: 'Authorization',
    private_key,
    business_id: account.business_id!,
    status: 'failed',
    amount: 0.0,
    source,
  };

  try {
    const headers = response.headers['set-cookie'];
    const session_id = headers![0]?.split(';')[0]?.split('=')[1];
    const bw_instance = headers![2]?.split(';')[0]?.split('=')[1];
    const csrfToken = parsedString.success.csrftoken[0];

    return { saveApiPayload, session_id, csrfToken, bw_instance };
  } catch (error) {
    console.log(`Error Authenticating Access. Message:${error}`);
  }
};

export default AccessAuthenticate;
