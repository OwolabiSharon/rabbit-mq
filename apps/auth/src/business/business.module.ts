import { AuthModule, Business, BusinessRolesEntity, UnVerifiedBusiness, User } from '@app/common';
import { Role } from '@app/common/database/models/role.entity';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { AuthorizeAminMiddleware } from '@app/common/middleware/authorize-admin';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { BusinessController } from './business.controller';
import { GetBusinessService } from './services/get-business.service';
import { getProfilePercentService } from './services/get-profile-percent';
import { GetRejectedBusinessService } from './services/get-rejected-business';
import { GetUnverifiedBusinessService } from './services/get-unverified-business';
import { GetUserBusinessService } from './services/get-user-business';
import { RejectBusinessService } from './services/reject-business';
import { UpdateBusinessService } from './services/update-business';
import { VerifyBusinessService } from './services/verifiy-business';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Business, Role, BusinessRolesEntity, UnVerifiedBusiness]),
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [BusinessController],
  providers: [
    UpdateBusinessService,
    getProfilePercentService,
    GetBusinessService,
    GetUserBusinessService,
    GetUnverifiedBusinessService,
    GetRejectedBusinessService,
    RejectBusinessService,
    VerifyBusinessService,
  ],
  exports: [],
})
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), AuthenticateUserMiddleware, AuthorizeAminMiddleware)
      .forRoutes(
        'business/unverified-business',
        'business/rejected-business',
        'business/reject-business',
        'business/verify-business',
      );
  }
}
