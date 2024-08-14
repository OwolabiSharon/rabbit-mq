import { User } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;

  last_login: Date;

  async fromEntity(payload: User) {
    const data = new User();
    data.id = payload.id;
    data.first_name = payload.first_name;
    data.last_name = payload.last_name;
    data.email = payload.email;
    data.phone_number = payload.phone_number;
    data.is_verified = payload.is_verified;
    data.verified_date = payload.verified_date;
    data.business = payload.business;
    data.last_login = payload.last_login;
    return data;
  }
}
