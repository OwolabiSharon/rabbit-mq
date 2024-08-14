import { IsEmail, IsNotEmpty, IsString, IsNumberString} from 'class-validator';

export class BvnLookupQueryDto {
  @IsNotEmpty({message:"Please input email"})
  @IsEmail({message:"Not valid email"})
  email: string;


  @IsNotEmpty({message:"Please input bvn"})
  @IsNumberString()
  bvn: string;

}