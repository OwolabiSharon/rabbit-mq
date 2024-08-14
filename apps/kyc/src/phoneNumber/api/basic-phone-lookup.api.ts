import axios from 'axios';

export async function getPhone({ phoneNo }: any) {
  try {
    const { data } = await axios.post(
      `https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/phone_number`,
      { number: phoneNo },
      {
        headers: {
          'x-api-key': process.env.IDENTITYPASSSECRETKEY!,
          'app-id': process.env.IDENTITYPASSAPPID!,
        },
      },
    );
    return data;
  } catch (err: any) {
    return err?.response?.data;
  }
}
