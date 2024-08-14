import { BusinessRolesEntity } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsString()
  @IsNotEmpty()
  business_id: string;

  invite_expiration_date: Date;

  async toEntity(payload: SendInviteDto) {
    const data = new BusinessRolesEntity();
    data.email = payload.email;
    data.role_id = payload.role_id;
    data.business_id = payload.business_id;
    data.invite_expiration_date = payload.invite_expiration_date;
    return data
  }
}
