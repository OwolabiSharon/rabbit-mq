import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class toggleDataAccess {
  @IsNotEmpty({message:"Please input email"})
  @IsEmail({message:"Not valid email"})
  email: string;
}