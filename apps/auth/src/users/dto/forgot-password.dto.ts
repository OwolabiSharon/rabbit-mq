import { User } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  async toEntity(payload: ForgotPasswordDto) {
    const data = new User();
    data.email = payload.email;
    return data;
  }
}
