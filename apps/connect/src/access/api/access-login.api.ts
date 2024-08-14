import axios from 'axios';
import * as qs from 'qs';
import * as moment from 'moment';

export async function AccessLoginApi(username: string, userpassphrase: string) {
  const data = {
    username,
    userpassphrase,
    ipaddress: 1,
    BOS_GENERIC_TOKEN: `<GenericToken><timestamp>${moment().format(
      'YYYY-MM-DD+HH:mm:ss.303',
    )}</timestamp><cookie>2.157615518.1647082195</cookie><UAS>Mozilla/5.0+(X11;+Linux+x86_64;+rv:96.0)+Gecko/20100101+Firefox/96.0</UAS><authenticated>0</authenticated><UserLoginID></UserLoginID><action>4</action><applicationID>ACCESSONLINE</applicationID><transactionType>LOGIN</transactionType></GenericToken>`,
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
    url: 'https://ibank.accessbankplc.com/RetailBank/bml/authentication/login_loginnocert.bml',
  };

  const response = await axios(options);

  return response;
}
