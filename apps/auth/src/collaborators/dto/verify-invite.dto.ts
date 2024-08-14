import { BusinessRolesEntity } from '@app/common';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class VerifyInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  business_id: string;

  @IsEnum(['Pending', 'Active', 'Rejected'])
  @IsString()
  status: string;

  user_id: string;

  invite_expiration_date: Date;

  async toEntity(payload: VerifyInviteDto) {
    const data = new BusinessRolesEntity();
    data.user_id = payload.user_id;
    data.business_id = payload.business_id;
    data.invite_expiration_date = payload.invite_expiration_date;
    return data;
  }
}
