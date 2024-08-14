import { Decrypt, Hex2a } from '@app/common';
import fetch from 'node-fetch';

export const FirstBankSendRequest = async (url: string, data: any, headers: any, deviceID: any) => {
  const readable = await fetch(url, {
    method: 'POST',
    body: data,
    headers: { ...headers },
  });

  const reading = await readable.text();

  const decryptData = await Decrypt(reading, deviceID);

  const decryptData2 = await Hex2a(decryptData);

  console.log(decryptData2);

  const readableVersion = JSON.parse(decryptData2);

  const firstBankReturn = await JSON.parse(readableVersion);

  return firstBankReturn;
};
