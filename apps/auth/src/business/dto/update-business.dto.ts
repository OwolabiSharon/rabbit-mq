import { Business } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsString()
  @IsNotEmpty()
  registration_address: string;

  @IsString()
  @IsNotEmpty()
  registration_number: string;

  balance: number;

  currency: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  is_business_verified: boolean;

  business_verified_date: Date;

  async updateEntity(payload: UpdateBusinessDto) {
    const data = new Business();
    data.name = payload.business_name;
    data.registration_address = payload.registration_address;
    data.registration_number = payload.registration_number;
    data.country = payload.country;
    data.is_business_verified = payload.is_business_verified;
    data.verified_date = payload.business_verified_date;
    data.balance = payload.balance;
    data.currency = payload.currency;
    return data;
  }
}
