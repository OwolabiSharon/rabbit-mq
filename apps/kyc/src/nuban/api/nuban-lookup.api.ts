import axios from 'axios';

export async function getNuban({ accountNumber, bankCode }: any) {
  try {
    const { data } = await axios.post(
      `https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/bank_account/advance`,
      { number: accountNumber, bank_code: bankCode },
      {
        headers: {
          'x-api-key': process.env.IDENTITYPASSSECRETKEY!,
          'app-id': process.env.IDENTITYPASSAPPID!,
        },
      },
    );
    return data;
  } catch (err: any) {
    console.error(`${err} -> while getting nuban`);
    return err?.response?.data;
  }
}
