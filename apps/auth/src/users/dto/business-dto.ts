import { Business } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  async toEntity(payload: CreateBusinessDto) {
    const data = new Business();
    data.user_id = payload.user_id;
    data.name = payload.name;
    return data;
  }
}
