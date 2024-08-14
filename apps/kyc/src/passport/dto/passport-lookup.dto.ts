import { IsDateString, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class PassportLookupDto {
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;
}
