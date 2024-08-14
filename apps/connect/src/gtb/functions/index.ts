import { encryptAccountPassword } from '@app/common';
import { BankCode, BankLogo, BankName } from '@app/common/utils/banks/enums';
import * as crypto from 'crypto';
import { LOGIN_SECRET } from '../../config';

export function GtbEncryptString(plaintext: any) {
  const publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAquiugN6mW6EsNIxDAVtF\novN1yGHEaQNybzkgmBp+hbgfS5knFsMcPMRNE1NqM6fOLwnJue43PouBAIkdvVNf\ng6sKMeJpg2Lc8LyXjtSr0xnOR0JFxwHrPQGxw33G0oKdi7wFlhZYQvCdNNe59dS2\nuKuYx0PKgVJlcrdZdwYqdOdUTFcbt1U2WFLfjLdS5wph0CiNxMyfSbSoQzmTKsMe\ng4QKRO/ZZCVLjoOdhJdpAgrUL3nnLu5w90BDJDtR0AJoAbX0gi0daIh/XqU3+XRb\nLTPaWmpkHjGFpiN5PtOxwLr2uFrqw9sGH3aLUfGCNGGsdZKipacF5GcncRrv5rUF\ncQIDAQAB\n-----END PUBLIC KEY-----';
  const encrypted: any = crypto
    .publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, plaintext)
    .toString('base64');
  return encrypted.toString('base64');
}

export function genCustomerCredentialsToSave(
  parsedResponse: any,
  index: number,
  device_id: string,
  login_id: string,
  password: string,
  public_key: string,
  business_id: string,
  AuthToken: string,
  user_reference: string,
) {
  const account_details = {
    customer_account_id: parsedResponse.USERID,
    account_no: parsedResponse.ACCOUNTS.ACCOUNT[index].NUMBER,
    device_id,
    bank_name: BankName.GTB,
    bank_logo: BankLogo.GTB,
    bank_code: BankCode.GTB,
    last_login: new Date(),
    public_key,
    user_reference,
    session_id: AuthToken,
    session_exp: new Date(Date.now() + 1000 * 60 * 5),
    account_status: '',
    account_type: parsedResponse.ACCOUNTS.ACCOUNT[index].ACCOUNTTYPE,
    bvn: parsedResponse.BVN,
    email: '',
    phone_number: parsedResponse.ACCOUNTS.ACCOUNT[index].TELNUM,
    full_name: parsedResponse.ACCOUNTS.ACCOUNT[index].CUSNAME,
    balance: parsedResponse.ACCOUNTS.ACCOUNT[index].AVAILABLEBALANCE,
    business_id,
    country: 'Nigeria',
    currency: parsedResponse.ACCOUNTS.ACCOUNT[index].CURRENCY,
  };

  const login_details = {
    account_id: '',
    login_id,
    password: encryptAccountPassword(password, LOGIN_SECRET),
  };

  const customer_account_id = parsedResponse.USERID;
  // iso_currency_code: '',
  // can_transfer_from: '',
  // can_transfer_to: '',

  return { account_details, login_details, customer_account_id };
}
