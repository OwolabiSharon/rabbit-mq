import { PaymentTransaction } from '@app/common';
import { TransactionType } from 'apps/types';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class AddTransanctionDto {
  trans_reference: string;

  @IsOptional()
  @IsString()
  business_id: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  narration: string;

  @IsEnum([TransactionType.CREDIT, TransactionType.DEBIT])
  @IsString()
  transaction_type: string;

  @IsOptional()
  @IsString()
  last_transaction_id: string;

  public toEntity(payload: AddTransanctionDto) {
    const data = new PaymentTransaction();
    data.trans_reference = payload.trans_reference;
    data.business_id = payload.business_id;
    data.amount = payload.amount;
    data.currency = payload.currency;
    data.email = payload.email;
    data.narration = payload.narration;
    data.transaction_type = payload.transaction_type;
    data.last_transaction_id = payload.last_transaction_id;
    return data;
  }
}

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  public updateEntity(payload: VerifyPaymentDto) {
    const data = new PaymentTransaction();
    data.transaction_status = payload.status;
    return data;
  }
}
