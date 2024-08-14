import { CustomerAccount } from '@app/common';

export type middlewareInfoType = {
  business_id: string;
  charges: number;
  account: CustomerAccount[];
};
