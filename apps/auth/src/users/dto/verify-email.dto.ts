import { User } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verification_token: string;

  verification_token_expiration: Date;

  verified_date: Date;

  is_verified: boolean;

  async toEntity(payload: VerifyEmailDto) {
    const data = new User();
    data.email = payload.email;
    return data;
  }

  async updateEntity(payload: VerifyEmailDto) {
    const data = new User();
    data.verified_date = payload.verified_date;
    data.is_verified = payload.is_verified;
    data.verification_token = payload.verification_token;
    data.verification_token_expiration = payload.verification_token_expiration;
    return data;
  }
}
