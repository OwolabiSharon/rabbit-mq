import { CustomerAccount, Encrypt, removeWhiteSpace } from '@app/common';
import axios from 'axios';
import ZenithSendRequest from './send-request.api';
import * as moment from 'moment';

export async function GenerateStatementApi(account: CustomerAccount, password: string, formatZenithDate: any) {
  const today = moment().format('DD-MM-YYYY');
  const lastYear = moment().subtract(1, 'year').format('DD-MM-YYYY');
  const zenithString = `"start=&accountNumber=${account.account_no}&startDate=${lastYear}&endDate=${today}&end="`;
  const encryptedString = await Encrypt(zenithString, account.device_id);
  const headers: any = {
    Host: 'zmobile.zenithbank.com',
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
    Appversion: '2.16.8',
    Deviceid: account.device_id,
    Sessionid: account.session_id,
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': 'okhttp/4.8.1',
    Connection: 'close',
  };

  try {
    const transactionValue = await ZenithSendRequest(
      'https://zmobile.zenithbank.com/zenith/api/account/transactions/search',
      encryptedString,
      headers,
      account.device_id!,
      password,
    );

    if (transactionValue.code !== 0) {
      console.log(`Failed to get zenith statement. Description: ${transactionValue.description}`);
      return;
    }

    const formattedStatement = transactionValue.transactions.map((item: any) => ({
      type: item.type,
      date: formatZenithDate(item?.date),
      narration: removeWhiteSpace(item.narration),
      amount: parseFloat(item.amount),
      tranId: item.tranId,
      closingBalance: item.closingBalance,
    }));

    await axios.post(`${process.env.BACKEND_URL}/api/v1/zenith/heroku`, {
      accountId: account.id,
      statements: formattedStatement,
    });
    return formattedStatement;
  } catch (error) {
    console.log(`Error when sending thing to heroku: ${error}`);
  }
}
