import { IDENTITYPASSAPPID, IDENTITYPASSSECRETKEY } from 'apps/kyc/config';
import axios from 'axios';

export async function getKenyaNin(nin: any, firstname, lastname, dob) {
  try {
    const { data } = await axios.post(
      'https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/ke/national_id',
      {
        nationalid: nin,
        firstname,
        lastname,
        dob,
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
