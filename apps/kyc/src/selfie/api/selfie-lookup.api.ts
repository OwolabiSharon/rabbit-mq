import axios from 'axios';

export async function getSelfie({ photoId, selfieImage }: any) {
  try {
    const { data } = await axios.post(
      'https://api.dojah.io/api/v1/kyc/photoid/verify',
      { photoid_image: photoId, selfie_image: selfieImage },
      {
        headers: {
          Authorization: process.env.DOJAHAUTHORIZATION!,
          AppId: process.env.DOJAHAPPID!,
        },
      },
    );
    return data;
  } catch (error: any) {
    throw error;
  }
}
