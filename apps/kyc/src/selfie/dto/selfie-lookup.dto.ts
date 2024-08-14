import { IsNotEmpty, IsString } from 'class-validator';

export class SelfieLookupDto {
  @IsString()
  @IsNotEmpty()
  photo_id: string;

  @IsString()
  @IsNotEmpty()
  selfie_image: string;
}
