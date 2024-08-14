import { IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
  to: string;

  subject: string;

  html: string;
}
