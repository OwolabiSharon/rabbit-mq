import {
  AccessBankDetails,
  AccountLoginDetails,
  App,
  AuthenticateAccountMiddleware,
  Business,
  BusinessRolesEntity,
  CONNECT_SERVICE,
  CustomerAccount,
  RmqModule,
  Role,
  SaveApiCallModule,
  VerifyCollaborator,
  VerifyRolePermission,
} from '@app/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstBankClientController } from './firstbank.controller';
import { FirstBankClientService } from './firstbank.service';
import { Permissions } from '@app/common/utils/roles';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';

@Module({
  imports: [
    RmqModule.register({ name: CONNECT_SERVICE }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      CustomerAccount,
      App,
      Role,
      BusinessRolesEntity,
      Business,
      AccountLoginDetails,
      AccessBankDetails,
    ]),
    SaveApiCallModule,
  ],
  controllers: [FirstBankClientController],
  providers: [FirstBankClientService],
  exports: [],
})
export class FirstBankClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        AuthenticateAccountMiddleware,
        VerifyRolePermission(Permissions.TRANSACTIONS),
        AuthenticateUserMiddleware,
        VerifyCollaborator,
      )
      .forRoutes('firstbank/regenerate/:account_id');
  }
}
