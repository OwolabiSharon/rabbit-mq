export function Balance(country: string) {
  let balance: number;
  let currency: string;
  if (country == 'Nigeria') {
    balance = 500;
    currency = 'NGN';
  }
  balance = 140;
  currency = 'KEY';

  return { balance, currency };
}
