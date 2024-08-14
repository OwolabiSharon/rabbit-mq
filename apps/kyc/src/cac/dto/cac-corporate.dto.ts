import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CacCorporateQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  rcNumber: string;
}
