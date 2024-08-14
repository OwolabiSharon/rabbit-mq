import {
  AccessBankDetails,
  AccountLoginDetails,
  ApiCall,
  CustomerAccount,
  RmqModule,
  SaveApiCallModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckForDuplicateAccountService } from './services/duplicate-account-check';
import { SaveApiCallService } from './services/save-api-call';
import { AccountController } from './account.controller';
import { ApiGetAccountService } from './services/api/get-account';
import { ApiGetAccountsService } from './services/api/get-accounts';
import { ApiGetIdentityService } from './services/api/get-identity';
import { DashboardGetAccountBankService } from './services/dashboard/get-bank-account';
import { DashboardGetAccountsBankService } from './services/dashboard/get-bank-accounts';
import { DashboardGetIdentityService } from './services/dashboard/get-identity';
import { DashboardGetAccountService } from './services/dashboard/get-account';
import { DashboardGetAccountsService } from './services/dashboard/get-accounts';
import { ReAutheticateAccountService } from './services/api/re-authenticate';
import { ReAuthorizeAccountService } from './services/api/re-authorize-account';
import { ApiSyncService } from './services/api/api-sync';
import { GenerateAccessStatement } from '../access/services/generate-statement';
import { GenerateFcmbStatement } from '../fcmb/services/generate-statement';
import { GenerateFirstBankStatement } from '../firstBank/services/firstbank-generate-statement';
import { GenerateGtbTransactionService } from '../gtb/services/gtb-generate-transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerAccount, ApiCall, AccountLoginDetails, AccessBankDetails]),
    EventEmitterModule.forRoot(),
    RmqModule,
    SaveApiCallModule,
  ],
  controllers: [AccountController],
  providers: [
    CheckForDuplicateAccountService,
    SaveApiCallService,
    ApiGetAccountService,
    ApiGetAccountsService,
    ApiGetIdentityService,
    DashboardGetAccountService,
    DashboardGetAccountsService,
    DashboardGetAccountBankService,
    DashboardGetAccountsBankService,
    DashboardGetIdentityService,
    ReAutheticateAccountService,
    ReAuthorizeAccountService,
    ApiSyncService,
    GenerateAccessStatement,
    GenerateFcmbStatement,
    GenerateFirstBankStatement,
    GenerateGtbTransactionService,
  ],
  exports: [CheckForDuplicateAccountService, SaveApiCallService],
})
export class AccountModule {}
