import { IsNotEmpty, IsString } from 'class-validator';

export class AccessQueryDto {
  account_no: string;
  device_id: string;
  user_reference: string;
}

export class AccessLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  userpassphrase;

  @IsNotEmpty()
  @IsString()
  public_key: string;

  @IsNotEmpty()
  @IsString()
  business_id: string;
}
