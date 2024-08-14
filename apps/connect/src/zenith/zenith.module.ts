import { Module } from '@nestjs/common';
import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqModule } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { ZenithController } from './zenith.controller';
import { ZenithLoginService } from './services/zenith-login';
import { GenerateZenithStatementService } from './services/zenith-generate-statement';
import { RegenerateZenithStatement } from './services/regenerate-zenith-statement';
import { ZenithAuthService } from './services/zenith-auth';
import { CheckForDuplicateAccountService } from '../account/services/duplicate-account-check';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([CustomerAccount, App, AccountLoginDetails, App]),
    EventEmitterModule.forRoot(),
    AccountModule,
  ],
  controllers: [ZenithController],
  providers: [
    ZenithLoginService,
    GenerateZenithStatementService,
    RegenerateZenithStatement,
    ZenithAuthService,
    CheckForDuplicateAccountService,
  ],
  exports: [],
})
export class ZenithModule {}
