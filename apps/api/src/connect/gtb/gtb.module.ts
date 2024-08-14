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
import { GtbClientController } from './gtb.controller';
import { GtbClientService } from './gtb.service';

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
      AccessBankDetails
    ]),
    SaveApiCallModule,
  ],
  controllers: [GtbClientController],
  providers: [GtbClientService],
})
export class GtbClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        AuthenticateAccountMiddleware,
        VerifyRolePermission(Permissions.TRANSACTIONS),
        AuthenticateUserMiddleware,
        VerifyCollaborator,
      )
      .forRoutes('gtb/regenerate/:account_id');
  }
}
