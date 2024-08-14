import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AccessModule } from './access/access.module';
import { ConnectController } from './connect.controller';
import { ConnectService } from './connect.service';
import { FcmbModule } from './fcmb/fcmb.module';
import { FirstBankModule } from './firstBank/first-bank.module';
import { GtbModule } from './gtb/gtb.module';
import { ZenithModule } from './zenith/zenith.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_CONNECT_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RmqModule,
    AccessModule,
    FcmbModule,
    FirstBankModule,
    GtbModule,
    ZenithModule,
  ],
  controllers: [ConnectController],
  providers: [ConnectService],
})
export class ConnectModule {}
