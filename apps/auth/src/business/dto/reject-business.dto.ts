import { IsOptional, IsString } from 'class-validator';

export class RejectBusinessDto {
  @IsOptional()
  @IsString()
  message: string;
}
