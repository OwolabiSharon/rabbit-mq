import { ApiCall, App, Business, SaveApiCallModule, VerifyCollaborator } from '@app/common';
import * as cookieParser from 'cookie-parser';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './balance.controller';
import { ApiGetBalanceService } from './services/api-get-balance';
import { DashboardGetBalanceService } from './services/dashboard-get-balance';
import { SaveApiCallService } from 'apps/connect/src/account/services/save-api-call';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Business, App, ApiCall]),
    SaveApiCallModule,
  ],
  controllers: [BalanceController],
  providers: [ApiGetBalanceService, DashboardGetBalanceService, SaveApiCallService],
})
export class BalanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), AuthenticateUserMiddleware, VerifyCollaborator)
      .forRoutes('balance/dashboard/:business_id');
  }
}
