import axios from 'axios';

export async function fcmbGetAccountApi(deviceId: string, formattedData: any) {
  const fcmbAccountReponse = await axios.get('https://mobileappserver.fcmb.com/moneytor-service/api/v1/fcmb/account/account_with_balance', {
    headers: {
      Host: 'mobileappserver.fcmb.com',
      Deviceid: deviceId,
      'Client-Id': '3MNT0001',
      Authorization: `bearer ${formattedData.result.access_token}`,
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'okhttp/4.9.3',
    },
  });

  return fcmbAccountReponse;
}
