import axios from 'axios';
import { GtbEncryptString } from '../functions';
import GtbHeaders from './headers';

export async function GtAuth(UserId: string, password: string, device: any) {
  const plainText = `{"UserId":"${UserId}","Password":"${password}"}`;
  const encrypted = GtbEncryptString(plainText);

  const header = GtbHeaders();

  const response = await axios.post(
    'https://gtworld.gtbank.com/GTWorldApp/api/Authentication/login-enc',
    {
      Uuid: device,
      Platform: 'Android',
      Model: 'Samsung Galaxy S9',
      Manufacturer: 'Genymotion',
      DeviceToken: '',
      UserId: `${UserId}`,
      OtherParams: `${encrypted}`,
      isGAPSLite: '0',
      Channel: 'GTWORLDv1.0',
      appVersion: '1.9.19',
      GLUserId: '',
      GLUsername: '',
    },
    { headers: { ...header } },
  );

  const result = await JSON.parse(response.data);
  return result;
}
