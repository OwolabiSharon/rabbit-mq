import { HttpStatus } from '@nestjs/common';
import { middlewareInfoType } from 'apps/kyc/types';
import { Request } from 'express';
import { CustomerAccount } from '../database';

export const successResponse = <T>({
  message,
  code = HttpStatus.OK,
  data,
  status = 'success',
}: {
  status?: string;
  message: string;
  code?: number;
  data?: T;
}) => {
  return { status, message, data };
};

export interface SuccessResponseType {
  status: string;
  message: string;
  data: any;
}

export interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
  };
  middlewareInfo: middlewareInfoType;
}

export interface CustomRequestTwo extends Request {
  user: {
    id: string;
    email: string;
  };
  middlewareInfo: { account: CustomerAccount; charges: number; private_key: string };
}
