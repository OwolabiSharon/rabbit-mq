import { User } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  
  verification_token: string;

  verification_token_expiration: Date;

  async toEntity(payload: ResendVerificationDto) {
    const data = new User();
    data.email = payload.email;
    return data;
  }

  async updateEntity(payload: ResendVerificationDto) {
    const data = new User();
    data.verification_token = payload.verification_token;
    data.verification_token_expiration = payload.verification_token_expiration;
    return data;
  }
}
