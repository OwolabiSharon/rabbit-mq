import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FetchAnalytics {
  @IsNotEmpty({message:"Please input id"})
  @IsString() 
  zeeh_id: string;
}