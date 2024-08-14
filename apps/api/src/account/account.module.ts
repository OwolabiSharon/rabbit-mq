import {
  App,
  AuthMiddlewareCreator,
  Business,
  CONNECT_SERVICE,
  CustomerAccount,
  RmqModule,
  VerifyAccountId,
  VerifyCollaborator,
} from '@app/common';
import * as cookieParser from 'cookie-parser';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CHARGES } from 'apps/api/config';
import { AccountClientService } from './account.service';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { AccountClientController } from './account.controller';

@Module({
  imports: [
    RmqModule.register({ name: CONNECT_SERVICE }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([CustomerAccount, App, Business]),
  ],
  controllers: [AccountClientController],
  providers: [AccountClientService],
})
export class AccountClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(parseFloat(CHARGES)))
      .forRoutes('account/live/bank-details/accounts/:public_key');
    consumer
      .apply(VerifyAccountId(parseFloat(CHARGES)))
      .forRoutes(
        'account/live/bank-details/account/:account_id',
        'account/live/identity/:account_id',
      );
    consumer
      .apply(cookieParser(), AuthenticateUserMiddleware, VerifyCollaborator)
      .forRoutes(
        'account/dash/accounts/bank-details/:public_key/:business_id',
        'account//dash/account/bank-details/:id',
        'account/dash/identity/:id',
      );
  }
}
