import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AdvancedPhoneLookupQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  phoneNo: string;
}
