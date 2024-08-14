import { IsNotEmpty, IsString } from 'class-validator';

export class KenyaNinLookupDto {
  @IsNotEmpty()
  @IsString()
  nin: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  dob: string;
}
