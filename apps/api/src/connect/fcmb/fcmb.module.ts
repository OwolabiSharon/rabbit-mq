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
import * as cookieParser from 'cookie-parser';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { Permissions } from '@app/common/utils/roles';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmbClientController } from './fcmb.controller';
import { FcmbClientService } from './fcmb.service';

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
  controllers: [FcmbClientController],
  providers: [FcmbClientService],
})
export class FcmbClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        AuthenticateAccountMiddleware,
        VerifyRolePermission(Permissions.TRANSACTIONS),
        AuthenticateUserMiddleware,
        VerifyCollaborator,
      )
      .forRoutes('fcmb/regenerate/:account_id');
  }
}
