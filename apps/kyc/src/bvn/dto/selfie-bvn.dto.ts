import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class SelfieBvnQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  bvn: string;

  @IsNotEmpty()
  @IsString()
  selfie_image: string;
}
