import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule, DatabaseModule } from '@app/common';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './users/users.module';
import { JwtGlobalModule } from './jwt-core.module';
import { VerifyCollaborator } from '@app/common/middleware/verify-collaborator';
import { CollaboratorModule } from './collaborators/collaborator.module';
import { BusinessModule } from './business/business.module';
import { HelloWorldController } from './hello-world/hello-world.controller';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
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
      envFilePath: './apps/auth/.env',
    }),
    JwtGlobalModule,
    CollaboratorModule,
    BusinessModule,
  ],
  controllers: [AuthController, HelloWorldController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(VerifyCollaborator).exclude().forRoutes('');
  // }
}
