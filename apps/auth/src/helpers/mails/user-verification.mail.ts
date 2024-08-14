import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MAIL_SERVICE, renderHtml } from '@app/common';
import { ORIGIN } from '../../config';

@Injectable()
export class UserVerificationMail {
  constructor(
    @Inject(MAIL_SERVICE)
    private mailClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(UserVerificationMail.name);
  async execute(name: string, email: string, verificationToken: string) {
    try {
      const html = await renderHtml(
        {
          name,
          verifyEmail: `${ORIGIN}/user/verify-email?token=${verificationToken}&email=${email}`,
        },
        'user_verification.html',
      );

      const data = {
        to: email,
        subject: 'Verify your email',
        html,
      };
 
      this.mailClient.emit('send_mail', { ...data });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
