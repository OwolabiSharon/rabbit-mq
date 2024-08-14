import { CustomerAccount } from '@app/common';
import axios from 'axios';
import * as moment from 'moment';
import GtbHeaders from './headers';

export async function GtbTransactionChild(
  SourceAccount: any,
  AuthToken: any,
  account: CustomerAccount,
) {
  const ToDate = moment().format('DD/MM/YYYY');
  const FromDate = moment().subtract(1, 'year').format('DD/MM/YYYY');

  const header = GtbHeaders();

  try {
    const response = await axios.post(
      'https://gtworld.gtbank.com/GTWorldApp/api/Account/new-account-history-two',
      {
        UserId: account.customer_account_id,
        SourceAccount,
        FromDate: `${FromDate}`,
        ToDate: `${ToDate}`,
        AuthToken,
        Udid: account.device_id,
      },
      { headers: { ...header } },
    );

    const gtResponse = await JSON.parse(response.data);

    console.log(gtResponse);

    return gtResponse;
  } catch (error) {
    console.log(error.response.data);
    console.log(error.message);
    throw error;
  }
}
