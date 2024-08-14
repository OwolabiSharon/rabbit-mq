import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({message:"Please input email"})
  @IsEmail({message:"Not valid email"})
  email: string;

  @IsNotEmpty({message:"Please input password"})
  @IsString() 
  password: string;
}