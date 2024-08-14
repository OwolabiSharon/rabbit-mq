import {
  ApiCall,
  App,
  Business,
  CustomerAccount,
  Role,
  SaveApiCallModule,
  StatementPage,
  VerifyAccountId,
  VerifyCollaborator,
  VerifyRolePermission,
} from '@app/common';
import * as cookieParser from 'cookie-parser';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementPageController } from './statement-page.controller';
import { CreateStatmentPageService } from './dashboard/create-statement-page';
import { GetStatmentsPageService } from './dashboard/get-statement-pages';
import { GetTransactionsPageService } from './dashboard/get-transaction';
import { Permissions } from '@app/common/utils/roles';
import { ApiGetStatement } from './api/api-get-statement';
import { ApiGetTransactionService } from './api/api-get-transaction';
import { GetStatmentsPageItemsService } from './dashboard/get-statement-page-items';
import { GetStatmentsPageItemsWithPeriodService } from './dashboard/get-statemet-page-items-with-period';
import { GetTransactionsDetailsService } from './dashboard/get-transaction-details';
import { CHARGES } from 'apps/api/config';
import { SaveApiCallService } from 'apps/connect/src/account/services/save-api-call';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([App, CustomerAccount, StatementPage, ApiCall, Business, Role]),
    SaveApiCallModule,
  ],
  controllers: [StatementPageController],
  providers: [
    CreateStatmentPageService,
    GetStatmentsPageService,
    GetTransactionsPageService,
    ApiGetStatement,
    ApiGetTransactionService,
    GetStatmentsPageItemsService,
    GetStatmentsPageItemsWithPeriodService,
    GetTransactionsDetailsService,
    SaveApiCallService,
  ],
})
export class StatementPageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), AuthenticateUserMiddleware, VerifyCollaborator)
      .forRoutes(
        'statementPage/dashboard/create/:business_id',
        'statementPage/dashboard/:business_id/:app_id',
        'statementPage/transaction/dashboard/:business_id/:public_key',
        'statementPage/transaction/dashboard/details/:account_id',
        'statementPage/dashboard/page/:business_id/:page_id',
        'statementPage/dashboard/pagequery/:business_id/:page_id',
      );
    consumer
      .apply(VerifyRolePermission(Permissions.STATEMENTS))
      .forRoutes('statementPage/dashboard/create/:business_id');
    consumer
      .apply(VerifyAccountId(parseFloat(CHARGES)))
      .forRoutes('statementPage/live/statement/:account_id', 'statementPage/live/:account_id');
  }
}
