import { CustomerAccount, Encrypt, removeWhiteSpace } from '@app/common';
import { FirstBankSendRequest } from './firstbank-fetch';
import FirstBankHeaders from './headers';
import * as moment from 'moment';

export async function firstBankGenerateStatementChild(account: CustomerAccount, arr: any) {
  const promises = arr.map(async (item: any) => {
    const dataToEncrypt = JSON.stringify({
      sessionID: account.session_id,
      accountNumber: account.account_no,
      startDate: moment(item).format('YYYY-MM-DD'),
      endDate: moment(item).format('YYYY-MM-DD'),
    });

    const encrypted = await Encrypt(dataToEncrypt, account.device_id!);

    const headers = FirstBankHeaders(account.device_id!, account.session_id!, 192);
    headers.Customtype = true;

    const readableAccountDetails = await FirstBankSendRequest(
      'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/account/statementFilterBy',
      encrypted,
      headers,
      account.device_id,
    );

    const formattedStatement = readableAccountDetails.statement.map((item: any) => ({
      type: item.transactionType === 'Cr' ? 'C' : 'D',
      date: item.date,
      amount: parseFloat(item.amount).toFixed(2),
      narration: removeWhiteSpace(item.narration),
      tranId: item.tranId,
      closingBalance: 0,
      serialNumber: item.serialNumber,
    }));

    return formattedStatement;
  });
  return Promise.all(promises);
}
