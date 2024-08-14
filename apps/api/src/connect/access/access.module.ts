import {
  AccessBankDetails,
  AccountLoginDetails,
  App,
  AuthenticateAccountMiddleware,
  AuthMiddlewareCreator,
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
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { Permissions } from '@app/common/utils/roles';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { AccessClientController } from './access.controller';
import { AccessClientService } from './access.service';

@Module({
  imports: [
    RmqModule.register({ name: CONNECT_SERVICE }),
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
    EventEmitterModule.forRoot(),
  ],
  controllers: [AccessClientController],
  providers: [AccessClientService],
  exports: [],
})
export class AccessClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        AuthenticateAccountMiddleware,
        VerifyRolePermission(Permissions.TRANSACTIONS),
        AuthenticateUserMiddleware,
        VerifyCollaborator,
      )
      .forRoutes('access/regenerate/:account_id');
  }
}
