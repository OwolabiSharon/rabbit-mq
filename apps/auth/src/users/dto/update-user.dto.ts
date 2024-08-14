import { User } from '@app/common';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  pic: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;

  async toEntity(payload: UpdateUserProfileDto) {
    const data = new User();
    if (payload.first_name) data.first_name = payload.first_name;
    if (payload.last_name) data.last_name = payload.last_name;
    if (payload.pic) data.pic = payload.pic;
    if (payload.phone_number) data.phone_number = payload.phone_number;
    return data;
  }
}
