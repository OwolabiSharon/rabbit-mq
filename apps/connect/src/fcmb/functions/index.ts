import { CustomerAccount, encryptAccountPassword } from '@app/common';
import { BankCode, BankLogo, BankName, JavaConstants } from '@app/common/utils/banks/enums';
import ExecShellCommand from '@app/common/utils/banks/exec-shell-command';

export const GetFcmbRawData = async (cmd: string) => {
  const encrypted: any = await ExecShellCommand(cmd);
  const splitedString = encrypted.split('\n');
  const body = splitedString[0];
  const secretKey = splitedString[1];
  return { body, secretKey };
};

export const GetReturnedFcmbRawValue = async (value: any) => {
  const { body, secretKey } = value;
  const newSecretKey = secretKey.replace(/\n/g, '');
  const messageToDecrypt = `${JavaConstants.Decrypt} '${newSecretKey}' '${body}'`;
  const messageAfterDecrypt: any = await ExecShellCommand(messageToDecrypt);
  return JSON.parse(messageAfterDecrypt);
};

export function getCredentialsWithAccount(fcmbAccountData: any, index: number) {
  const data = fcmbAccountData[index];
  return {
    balance: data.accountBalance.availableBalance,
    full_name: data.account.full_name,
    email: data.account.email,
    phone_number: data.account.phone_number,
    account_no: data.account.account_no,
    customer_account_id: data.account.id,
    account_type: data.account.account_type,
    currency: data.account.currency,
    account_status: data.account.active === true ? 'active' : 'inactive',
    country: data.account.country,
  };
}

export function getCustomToSave(account: any, accountDetails: any) {
  return { ...account, ...accountDetails };
}

export function genCustomerCredentialsToSaveOneAccount(
  fcmb_response: any,
  device_id: string,
  login_details: { username: string; password: string },
  public_key: string,
  business_id: string,
  user_reference: string,
) {
  return {
    account_details: {
      session_id: fcmb_response.access_token,
      public_key,
      user_reference,
      business_id,
      bank_name: BankName.FCMB,
      bank_logo: BankLogo.FCMB,
      bank_code: BankCode.FCMB,
      session_exp: new Date(new Date().getTime() + 1000 * 60 * 5),
      last_login: new Date(),
      full_name: fcmb_response.fullName,
      bvn: fcmb_response.customerBvn,
      dob: new Date(fcmb_response.dob),
      email: fcmb_response.email,
      device_id: device_id,
      phone_number: fcmb_response.phoneNumber,
    },
    login_details: {
      login_id: login_details.username,
      password: encryptAccountPassword(login_details.password, process.env.LOGIN_SECRET!),
    },
  };
}
