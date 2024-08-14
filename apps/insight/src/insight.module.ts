import { InsightController } from './insight.controller';
import { InsightService } from './insight.service';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule, DatabaseModule } from '@app/common';
import * as Joi from 'joi';
import { InsightAuthModule } from './auth/auth.module';
import { InsightConnectModule } from './connect/connect.module';
import { InternalTeamModule } from './internalTeam/internalTeam.module';



@Module({
  imports: [
    InsightAuthModule,
    InsightConnectModule,
    InternalTeamModule,
    DatabaseModule,
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      
      }),
      envFilePath: './apps/insight/.env',
    })
  ],
  controllers: [InsightController],
  providers: [InsightService],
})
export class InsightModule {}

