import { IsNotEmpty, IsNumberString } from 'class-validator';

export class NinLookupQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  nin: string;
}
