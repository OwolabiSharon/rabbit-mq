import { encryptAccountPassword } from '@app/common';
import { BankCode, BankLogo, BankName } from '@app/common/utils/banks/enums';

export function getCredentialsWithAccount(readableAccountDetails: any, index: number) {
  const account = {
    account_no: readableAccountDetails.accounts[index].accountNumber,
    account_type: readableAccountDetails.accounts[index].accountType,
    currency: readableAccountDetails.accounts[index].currencyCode,
    account_status: readableAccountDetails.accounts[index].active,
    balance: readableAccountDetails.accounts[index].availableBalance,
  };
  return account;
}

export function genCustomerCredentialsToSave(
  firstBankResponse: any,
  deviceID: string,
  pin: any,
  public_key: string,
  business_id: string,
  user_reference: string,
) {
  const newAccountToSave = {
    account_details: {
      session_id: firstBankResponse.sessionID,
      full_name: `${firstBankResponse.firstName} ${firstBankResponse.lastName}`,
      email: firstBankResponse.email,
      bank_name: BankName.FIRSTBANK,
      public_key,
      user_reference,
      device_id: deviceID,
      session_exp: new Date(new Date().getTime() + 1000 * 60 * 5),
      business_id,
      last_login: new Date(),
      bank_logo: BankLogo.FIRSTBANK,
      bank_code: BankCode.FIRSTBANK,
      account_no: '',
      account_type: '',
      currency: '',
      account_status: '',
      country: 'Nigeria',
    },
    acquiringBin: firstBankResponse.acquiringBin,
    bank_id: firstBankResponse.bankId,
    balance: 0,
    billerVersionNumber: firstBankResponse.billerVersionNumber,
    login_details: {
      login_id: deviceID,
      password: encryptAccountPassword(pin, process.env.LOGIN_SECRET!),
    },
  };

  return newAccountToSave;
}
