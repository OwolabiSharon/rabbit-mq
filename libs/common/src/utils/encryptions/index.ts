import { AES, enc, PBKDF2 } from 'crypto-js';
import * as crypto from 'crypto';

/**
 *@description This function encrypts any sensitive bank details data like password
 * @param {*} data mongoose data object to encrypt
 * @param {*} secret secret key to encrypt
 * @returns encrypted data
 */
const password = '12345678909876541234567890987654';

export const encryptAccountPassword = (data: string, secret: string) => {
  const ciphertext = AES.encrypt(data, secret).toString();
  return ciphertext;
};

/**
 *@description This function is used to decrypt encrypted data
 * @param {*} data encrypted value to decrypt
 * @param {*} secret secret key to decrypt encrypted data
 * @returns decrypted data
 */
export const decryptAccountPassword = (data: string, secret: string) => {
  const bytes = AES.decrypt(data, secret);
  const originalText = bytes.toString(enc.Utf8);
  return originalText;
};

//Encrypt and Decrypt all bank related stuffs
export const Decrypt = async (transitmessage: any, deviceId: string) => {
  const salt = enc.Hex.parse('4321');
  const iv = enc.Hex.parse(password);
  const encrypted = transitmessage;

  const key = PBKDF2(deviceId, salt, {
    keySize: 8,
    iterations: 23,
  });

  const decrypted = AES.decrypt(encrypted, key, {
    iv,
  });

  return decrypted;
};

export const Encrypt = async (transitmessage: any, deviceId: string) => {
  const salt = enc.Hex.parse('4321');
  const key = PBKDF2(deviceId, salt, {
    keySize: 8,
    iterations: 23,
  });
  const iv = enc.Hex.parse(password);
  const encrypted = AES.encrypt(transitmessage, key, {
    iv,
  });
  return encrypted.toString();
};

export const Hex2a = async (hexx: any) => {
  const hex = hexx.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};
