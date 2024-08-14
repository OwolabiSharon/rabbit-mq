import { IsNotEmpty, IsNumberString } from 'class-validator';

export class LicenseLookupQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  licenseNo: string;
}
