import { App } from '@app/common';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppDto {
  @IsOptional()
  @IsString()
  logo: string;

  business_id: string;

  @IsString()
  @IsNotEmpty()
  app_name: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsArray()
  @IsNotEmpty()
  account_type: string;

  public_key: string;

  sandbox_key: string;

  private_key: string;

  @IsString()
  @IsNotEmpty()
  page_link: string;

  async toEntity(payload: CreateAppDto) {
    const data = new App();
    data.app_name = payload.app_name;
    data.product = payload.product;
    data.business_id = payload.business_id;
    data.account_type = payload.account_type;
    data.public_key = payload.public_key;
    data.sandbox_key = payload.sandbox_key;
    data.private_key = payload.private_key;
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
