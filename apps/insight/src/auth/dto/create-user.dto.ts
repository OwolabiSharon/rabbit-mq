
import { IsEmail, IsNotEmpty, IsString, IsNumberString} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({message:"Please input name"})
  @IsString()
  name: string;
  

  @IsNotEmpty({message:"Please input email"})
  @IsEmail({message:"Not valid email"})
  email: string;

  @IsNotEmpty({message:"Please input password"})
  @IsString()
  password: string;

  @IsNotEmpty({message:"Please input bvn"})
  @IsNumberString()
  bvn: string;

}