import { RmqService } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService, private readonly rmqService: RmqService) {}

  @EventPattern('user_created_mail')
  async UserCreatedMail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.mailService.createUserMail(data);
    this.rmqService.ack(context);
  }

  @EventPattern('send_mail')
  async SendMail(@Payload() data: MailDto, @Ctx() context: RmqContext) {
    this.mailService.execute(data);
    this.rmqService.ack(context);
  }
}
