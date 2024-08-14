import { FLUTTERWAVE_SECRET_KEY } from 'apps/payment/config';

export const flw = {
  url: 'https://api.flutterwave.com/v3/payments',
  headers: {
    Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  customizations: {
    title: 'Smarg',
    logo: 'https://media-exp1.licdn.com/dms/image/C4E0BAQEHHSD9Iq8M7g/company-logo_200_200/0/1609863641069?e=2147483647&v=beta&t=EAaT2m5Eb_haL0igfNAfIL-YMZwBmOUJAFSE0qoImPA',
  },
  redirect_url: 'https://google.com/',
};
