import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class TinLookupQueryDto {
  @IsNotEmpty()
  @IsString()
  tin: string;
}
