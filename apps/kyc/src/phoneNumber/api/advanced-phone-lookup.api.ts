import axios from 'axios';

export async function getPhoneAdvance({ phoneNo }: any) {
  try {
    const { data } = await axios.post(
      `https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/phone_number/advance`,
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
    console.log(err);
    throw err;
  }
}
