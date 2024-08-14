import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  password_token: string;

  async toEntity(payload: ResetPasswordDto) {
    const data = new InsightsUser();
    data.email = payload.email;
    data.password = payload.password;
    data.password_token = payload.password_token;
    return data;
  }
}