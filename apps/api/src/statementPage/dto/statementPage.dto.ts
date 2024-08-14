import { StatementPage } from '@app/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StatementPageDto {
  @IsNotEmpty()
  @IsString()
  page_name: string;

  @IsNotEmpty()
  @IsString()
  period: string;

  @IsNotEmpty()
  @IsString()
  app_id: string;

  @IsOptional()
  @IsString()
  page_description: string;

  business_id: string;

  no_of_account: number;

  async toEntity(payload: StatementPageDto) {
    const data = new StatementPage();
    data.page_name = payload.page_name;
    data.period = payload.period;
    data.app_id = payload.app_id;
    data.page_description = payload.page_description;
    data.business_id = payload.business_id;
    data.no_of_account = payload.no_of_account;
    return data;
  }
}
