import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CacLookupQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  rcNumber: string;
}
