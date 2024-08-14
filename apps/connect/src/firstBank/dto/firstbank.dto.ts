import { IsNotEmpty, IsString } from 'class-validator';

export class FirstBankQueryDto {
  account_no: string;
  device_id: string;
  user_reference: string;
  resend: boolean;
  checkOtp: boolean;
  resendmPin: boolean;
}

export class FirstBankLoginDto {
 
  mPin: string;

  
  card_no: string;

  otp: string;

  
  card_pin: string;

  
  public_key: string;

  
  business_id: string;
}
