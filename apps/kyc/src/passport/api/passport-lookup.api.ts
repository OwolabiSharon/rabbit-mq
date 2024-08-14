import axios from 'axios';

type childProps = {
  passportNumber: string;
  lastName: string;
  firstName: string;
  dob: Date;
};

export async function getPassport(message: childProps) {
  const { passportNumber, lastName, firstName, dob } = message;
  try {
    const { data } = await axios.post(
      'https://api.myidentitypay.com/api/v2/biometrics/merchant/data/verification/national_passport',
      { number: passportNumber, first_name: firstName, last_name: lastName, dob },
      {
        headers: {
          'x-api-key': process.env.IDENTITYPASSSECRETKEY!,
          'app-id': process.env.IDENTITYPASSAPPID!,
        },
      },
    );
    return data;
  } catch (err: any) {
    return err.response.data;
  }
}
