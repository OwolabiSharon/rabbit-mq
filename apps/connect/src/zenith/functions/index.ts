import { encryptAccountPassword } from '@app/common';
import { BankCode, BankLogo, BankName } from '@app/common/utils/banks/enums';

export function generateAccountToSave(
  zenithServerResponse: any,
  index: number,
  device_id: string,
  login_id: string,
  password: string,
  public_key: string, // this should be passed from the widget, representing which company's client is being saved
  business_id: string,
  user_reference: string,
) {
  const customerToSave = {
    account_details: {
      account_no: zenithServerResponse.accounts[index].accountNumber,
      device_id,
      bank_name: BankName.ZENITH,
      bank_logo: BankLogo.ZENITH,
      bank_code: BankCode.ZENITH,
      last_login: new Date(),
      public_key,
      user_reference,
      session_id: zenithServerResponse.sessionID,
      session_exp: new Date(Date.now() + 1000 * zenithServerResponse.sessionTimeoutInSeconds),
      account_status: zenithServerResponse.accounts[index].status,
      currency: zenithServerResponse.accounts[index].currency,
      bvn: zenithServerResponse.bvn,
      email: zenithServerResponse?.email || '',
      phone_number: zenithServerResponse?.phoneNumber || '',
      full_name: zenithServerResponse.accounts[index].accountName,
      balance: zenithServerResponse.accounts[index].availableBalance,
      dob: zenithServerResponse?.dob, // date
      business_id,
      country: zenithServerResponse?.country || 'Nigeria',
      account_type: zenithServerResponse.accounts[index].accountType,
    },

    loginDetails: {
      login_id,
      password: encryptAccountPassword(password, process.env.LOGIN_SECRET!),
    },

    iso_currency_code: zenithServerResponse.accounts[index].isoCurrencyCode,
    can_transfer_from: zenithServerResponse.accounts[index].canTransferFrom,
    can_transfer_to: zenithServerResponse.accounts[index].canTransferTo,
  };

  return customerToSave;
}
