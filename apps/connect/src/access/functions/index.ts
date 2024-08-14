import { encryptAccountPassword } from '@app/common';
import { BankCode, BankLogo, BankName } from '@app/common/utils/banks/enums';

export function genAccountCredentialsToSave(
  accessDetailsParsedString: any,
  index: number,
  username: string,
  userpassphrase: any,
  public_key: string,
  business_id: string,
  user_reference: string,
  bw_instance: string,
  csrf_token: string,
  session_id: string,
) {
  const access = accessDetailsParsedString.response.collection[0].model[index];
  return {
    account_details: {
      account_no: access.accountno[0],
      bank_name: BankName.ACCESS,
      bank_logo: BankLogo.ACCESS,
      bank_code: BankCode.ACCESS,
      last_login: new Date(),
      public_key,
      user_reference,
      business_id,
      device_id: 'dklsklsklk', // just a random string, not really neccessary for access
      session_id,
      session_exp: new Date(Date.now() + 1000 * 60 * 2),
      bvn: access.text1[0],
      currency: access.currency[0],
      account_type: access.type[0],
      email: '',
      full_name: access.name[0],
      balance: access.balance_home_raw[0],
      dob: null,
      country: 'Nigeria',
    },

    login_details: {
      login_id: username,
      account_id: '',
      password: encryptAccountPassword(userpassphrase, process.env.LOGIN_SECRET!),
    },

    access_details: {
      bw_instance,
      csrf_token,
      access_id: access.id[0],
      account_id: '',
    },
  };
}
