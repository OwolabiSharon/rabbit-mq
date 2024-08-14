import { Encrypt } from '@app/common';
import { FirstBankSendRequest } from './firstbank-fetch';
import FirstBankHeaders from './headers';

export async function FirstBankOtpApi(otpMesage: any, parsedCardDetails: any, password: string) {
  const encryptedOtpMessage = await Encrypt(otpMesage, parsedCardDetails.deviceID);

  const verifyOTPHeaders = FirstBankHeaders(parsedCardDetails.deviceID, null, 64);

  const readableverifyResponse = await FirstBankSendRequest(
    'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/user/deviceActivation/complete',
    encryptedOtpMessage,
    verifyOTPHeaders,
    parsedCardDetails.deviceID,
  );

  return readableverifyResponse;
}
