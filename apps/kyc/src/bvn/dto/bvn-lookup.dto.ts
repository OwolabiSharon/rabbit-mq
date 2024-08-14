import { IsNotEmpty, IsNumberString } from 'class-validator';

export class BvnLookupQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  bvn: string;
}
