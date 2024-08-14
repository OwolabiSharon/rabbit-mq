/**
 *
 * @param {String} url - url to send the request to
 * @param {String} encryptedData - encrypted data to send
 * @param {Object} headers - headers to send with the request
 * @param {String} deviceId - device id of the customer
 * @returns - Response send by the bank
 */

import { Decrypt, Hex2a } from '@app/common';
import axios from 'axios';
import ZenithHeaders from './headers';

const ZenithSendRequest = async (url: string, encryptedData: any, header: typeof ZenithHeaders, deviceId: string, password: string) => {
  const response = await axios.post(url, encryptedData, { headers: { ...header } });
  const decryptData = await Decrypt(response.data, deviceId);
  const decryptData2 = await Hex2a(decryptData);
  const readableVersion = JSON.parse(decryptData2);

  return readableVersion;
};

export default ZenithSendRequest;
