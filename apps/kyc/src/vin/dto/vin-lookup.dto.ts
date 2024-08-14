import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class VinLookupDto {
  @IsNumberString()
  @IsString()
  vin: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
