import { Role } from '@app/common';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddRoleDto {
  @IsNotEmpty()
  @IsString()
  user_type: string;

  @IsNotEmpty()
  @IsArray()
  permissions: string[];

  business_id: string;

  async toEntity(payload: AddRoleDto) {
    const data = new Role();
    data.user_type = payload.user_type;
    data.permissions = payload.permissions;
    data.business_id = payload.business_id;
    return data
  }
}
