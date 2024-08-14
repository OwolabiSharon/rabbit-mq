import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class NubanLookupDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  bankCode: number;
}
