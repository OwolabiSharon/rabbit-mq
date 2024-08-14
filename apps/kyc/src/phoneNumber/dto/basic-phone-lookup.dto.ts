import { IsNotEmpty, IsNumberString } from 'class-validator';

export class BasicPhoneLookupQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  phoneNo: string;
}
