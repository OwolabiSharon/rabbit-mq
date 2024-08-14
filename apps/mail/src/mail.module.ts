import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_MAIL_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RmqModule,
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
