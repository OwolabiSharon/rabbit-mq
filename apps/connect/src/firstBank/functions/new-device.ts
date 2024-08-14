import { Encrypt } from '@app/common';
import FirstBankHeaders from '../api/headers';
import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import { FirstBankSendRequest } from '../api/firstbank-fetch';

export async function sharedNewDeviceFunction(
  deviceID: any,
  cardNumber: any,
  cardPin: any,
  mPin: any,
  publicKey: string,
  orgId: string,
  userReference: string,
) {
  const newDevice = JSON.stringify({
    deviceID,
    cardNumber,
    pin: cardPin,
    deviceModel: 'unknown',
  });
  const encryptedNewDevice = await Encrypt(newDevice, deviceID);
  const registerNewDeviceHeader = FirstBankHeaders(deviceID, null, 152);

  registerNewDeviceHeader.Customtype = true;

  const readableNewDevice = await FirstBankSendRequest(
    'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/user/deviceActivation/initiate',
    encryptedNewDevice,
    registerNewDeviceHeader,
    deviceID,
  );

  if (readableNewDevice.code !== 0) {
    throw new InternalServerErrorException({
      status: 'error',
      code: readableNewDevice.code,
      message: readableNewDevice.description,
    });
  }

  const firstBankDirectoryOTP = path.join(__dirname, '../../public/firstBank');
  if (!fs.existsSync(firstBankDirectoryOTP)) {
    fs.mkdirSync(firstBankDirectoryOTP);
  }

  const firstBankPathOTP = path.join(__dirname, `../../public/firstBank/${cardNumber}.json`);

  fs.writeFileSync(
    firstBankPathOTP,
    JSON.stringify({
      mPin,
      cardNumber,
      cardPin,
      publicKey,
      orgId,
      bankId: readableNewDevice.bankId,
      deviceID,
      userReference,
    }),
  );

  return {
    otp: true,
    message: 'Kindly provide the password sent to your registered phoneNumber/email',
  };
}
