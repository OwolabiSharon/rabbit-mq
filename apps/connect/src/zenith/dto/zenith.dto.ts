import { IsNotEmpty, IsString } from 'class-validator';

export class ZenithQueryDto {
  account_no: string;
  device_id: string;
  user_reference: string;
}

export class ZenithLoginDto {
  @IsNotEmpty()
  @IsString()
  login_id: string;

  @IsNotEmpty()
  @IsString()
  password;

  @IsNotEmpty()
  @IsString()
  public_key: string;

  @IsNotEmpty()
  @IsString()
  business_id: string;
}
