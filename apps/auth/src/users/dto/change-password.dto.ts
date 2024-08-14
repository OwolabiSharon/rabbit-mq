import { User } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;

  async toEntity(payload: ChangePasswordDto) {
    const data = new User();
    data.password = payload.new_password;
    return data
  }
}
