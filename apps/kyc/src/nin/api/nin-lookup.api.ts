import { IDENTITYPASSAPPID, IDENTITYPASSSECRETKEY } from 'apps/kyc/config';
import axios from 'axios';

export async function getnin(nin: any) {
  try {
    const { data } = await axios.post(
      'https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/nin_wo_face',
      {
        number: nin,
      },
      {
        headers: {
          'x-api-key': IDENTITYPASSSECRETKEY,
          'app-id': IDENTITYPASSAPPID,
        },
      },
    );
    return data;
  } catch (err: any) {
    return err.response.data;
  }
}
