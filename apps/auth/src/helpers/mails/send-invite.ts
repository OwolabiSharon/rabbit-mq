import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MAIL_SERVICE, renderHtml } from '@app/common';
import { ORIGIN } from '../../config';

@Injectable()
export class SendInviteMail {
  constructor(
    @Inject(MAIL_SERVICE)
    private mailClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(SendInviteMail.name);
  async execute(
    email: string,
    business_id: string,
    business_name: string,
    business_owner: string,
    business_email: string,
  ) {
    try {
      const html = await renderHtml(
        {
          business_name,
          business_owner,
          business_email,
          inviteLink: `${ORIGIN}/user/invitation?email=${email}&business_id=${business_id}`,
        },
        'send_invite.html',
      );

      const data = {
        to: email,
        subject: `You have been invited to join ${business_name} team on Zeeh Africa`,
        html,
      };

      this.mailClient.emit('send_mail', { ...data });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
