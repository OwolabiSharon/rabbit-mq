import { Industry } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class IndustryDto {
  @IsNotEmpty()
  @IsString()
  app_id: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  async toEntity(payload: IndustryDto) {
    const data = new Industry();
    data.app_id = payload.app_id;
    data.label = payload.label;
    data.value = payload.value;
  }
}
