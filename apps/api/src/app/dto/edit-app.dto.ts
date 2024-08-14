import { App } from '@app/common';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAppDto {
  @IsOptional()
  @IsString()
  logo: string;

  @IsString()
  @IsNotEmpty()
  app_name: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsArray()
  @IsNotEmpty()
  product: string;

  @IsArray()
  @IsNotEmpty()
  account_type: string;

  @IsString()
  @IsNotEmpty()
  page_link: string;

  async updateEntity(payload: UpdateAppDto) {
    const data = new App();
    data.app_name = payload.app_name;
    data.product = payload.product;
    data.account_type = payload.account_type;
    data.page_link = payload.page_link;
    data.logo = payload.logo;
    return data;
  }

  async fromEntity(payload: App) {
    const data = new App();
    data.app_name = payload.app_name;
    data.product = payload.product;
    data.account_type = payload.account_type;
    data.page_link = payload.page_link;
    data.send_notification_to = payload.send_notification_to;
    data.logo = payload.logo;
    return data;
  }
}
