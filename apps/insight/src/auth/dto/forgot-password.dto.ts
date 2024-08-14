import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  async toEntity(payload: ForgotPasswordDto) {
    const data = new InsightsUser();
    data.email = payload.email;
    return data;
  }
}
