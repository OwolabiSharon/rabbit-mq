import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { AccessHeaders } from './headers';

export async function accessAccountDetailsApi(BwInstance: any, bwSessionID: any, accessDetailsParams: any) {
  const accessHeaders = await AccessHeaders(BwInstance, bwSessionID);
  const accessDetailsResponse = await axios.post('https://ibank.accessbankplc.com/RetailBank/bml/account/accountsCustomer.bml', accessDetailsParams, {
    headers: { ...accessHeaders },
  });

  const accessDetailsParsedString = await parseStringPromise(accessDetailsResponse.data);
  return accessDetailsParsedString
}
