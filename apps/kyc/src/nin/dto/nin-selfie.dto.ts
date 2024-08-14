import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class NinSelfieQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  nin: string;

  @IsNotEmpty()
  @IsString()
  selfie_image: string;
}
