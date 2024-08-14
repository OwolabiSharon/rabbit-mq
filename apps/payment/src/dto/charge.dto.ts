import { Currency } from 'apps/types';
import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ChargeDto {
  @IsEnum([Currency.USD, Currency.NGN])
  @IsString()
  currency: string;

  @IsNumberString()
  amount: number;

  @IsString()
  fullname: string;

  @IsString()
  narration: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;
}
