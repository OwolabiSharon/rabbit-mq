import { BusinessRolesEntity } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  role_id: string;

  async toEntity(payload: ChangeRoleDto) {
    const data = new BusinessRolesEntity();
    data.role_id = payload.role_id;
    return data;
  }
}
