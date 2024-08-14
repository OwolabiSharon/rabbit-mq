import { User } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateBusinessDto } from './business-dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;
  @IsNotEmpty()
  @IsString()
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  business: CreateBusinessDto[];

  @IsNotEmpty()
  @IsString()
  password: string;

  verification_token: string;

  verification_token_expiration: Date;

  async toEntity(payload: CreateUserDto) {
    const user = new User();
    user.first_name = payload.first_name;
    user.last_name = payload.last_name;
    user.email = payload.email;
    user.password = payload.password;
    user.verification_token = payload.verification_token;
    user.verification_token_expiration = payload.verification_token_expiration;
    user.business = payload.business;
    return user;
  }
}
