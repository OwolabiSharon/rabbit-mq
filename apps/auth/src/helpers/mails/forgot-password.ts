import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MAIL_SERVICE, renderHtml } from '@app/common';
import { ORIGIN } from '../../config';

@Injectable()
export class ForgotPasswordMail {
  constructor(
    @Inject(MAIL_SERVICE)
    private mailClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(ForgotPasswordMail.name);
  async execute(email: string, name: string, password_token: string) {
    try {
      const html = await renderHtml(
        {
          name,
          passwordResetUrl: `${ORIGIN}/user/reset-password?token=${password_token}&email=${email}`,
        },
        'forgort_password.html',
      );

      const data = {
        to: email,
        subject: 'Reset Password',
        html,
      };

      this.mailClient.emit('send_mail', { ...data });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
