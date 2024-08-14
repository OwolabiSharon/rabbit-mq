import { Injectable, Logger } from '@nestjs/common';
import { MailDto } from './dto/mail.dto';
import * as nodemailer from 'nodemailer';
import { GMAIL_PASS, GMAIL_USER } from '../config/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  async createUserMail(data: any) {
    this.logger.log('Mail sent', data);
  }

  async execute(data: MailDto) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'premium111.web-hosting.com',
        port: 465,
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS,
        },
      });

      const { to, subject, html } = data;

      return transporter.sendMail(
        {
          from: GMAIL_USER,
          to,
          subject,
          html,
        },
        (err: any, info: any) => {
          if (err) throw err;
          this.logger.log(`Message ${info.messageId} sent to ${to}`);
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
