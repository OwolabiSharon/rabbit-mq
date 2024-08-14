import { DOJAHAPPID, DOJAHAUTHORIZATION } from 'apps/kyc/config';
import axios from 'axios';

export async function selfieNin(nin: string, selfie_image: string) {
  try {
    const { data } = await axios.post(
      'https://api.dojah.io/api/v1/kyc/nin/verify',
      { nin, selfie_image },
      {
        headers: {
          Authorization: DOJAHAUTHORIZATION,
          AppId: DOJAHAPPID,
        },
      },
    );
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
}
