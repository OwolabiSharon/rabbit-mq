import axios from 'axios';
import { AccessHeaders } from './headers';
import { parseStringPromise } from 'xml2js';

export async function generateAccessStatemntApi(sessionId, BwInstance, params) {
  const headers = AccessHeaders(BwInstance, sessionId);
  const accessStatementResponseXml = await axios.post('https://ibank.accessbankplc.com/RetailBank/bml/history/customstatement_init.bml', params, {
    headers: { ...headers },
  });

  const accessStatementResponse = await parseStringPromise(accessStatementResponseXml.data);
  return accessStatementResponse;
}
