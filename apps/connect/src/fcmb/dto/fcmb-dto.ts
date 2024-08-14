import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FcmbQueryDto {
  account_no: string;
  device_id: string;
  user_reference: string
}

export class LoginFcmbDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  public_key: string;

  @IsNotEmpty()
  @IsString()
  business_id: string;
}
