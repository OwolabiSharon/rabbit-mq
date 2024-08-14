import { IsNotEmpty, IsString } from 'class-validator';

export class GtbQueryDto {
  account_no: string;
  device_id: string;
  user_reference: string;
}

export class GtbLoginDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

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
