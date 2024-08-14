import * as crypto from 'crypto';

export const GenerateKey = () => crypto.randomBytes(16).toString('hex');

export const generateDeviceId = (byte?: number) =>
  crypto.randomBytes(byte || 8).toString('hex');
