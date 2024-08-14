import axios from 'axios';

export async function getDriverLicense({ licenseNo }: any) {
  try {
    const { data } = await axios.get(
      `https://api.dojah.io/api/v1/kyc/dl?license_number=${licenseNo}`,
      {
        headers: {
          Authorization: process.env.DOJAHAUTHORIZATION!,
          AppId: process.env.DOJAHAPPID!,
        },
      },
    );
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
}
