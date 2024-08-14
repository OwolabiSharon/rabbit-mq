import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GenerateAnalytics {
  @IsNotEmpty({message:"Please input email"})
  @IsEmail({message:"Not valid email"})
  email: string;

  @IsNotEmpty({message:"Please input statement name"})
  @IsString() 
  statementName: string;
}