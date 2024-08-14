import axios from 'axios';
export interface AccountConnectBodyType {
  accountNumber: string;
  bankName: string;
  bankCode: string;
  balance: number;
  currency: string;
  email: string;
  bvn: string;
  userReference: string;
  fullName: string;
}
export const accountConnectSuccessWebhook = async (
  url: string,
  account: Partial<AccountConnectBodyType>,
) => {
  await axios.post(url, {
    action: 'bank-account-added',
    payload: account,
  });
};
