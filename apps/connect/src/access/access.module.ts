import {
  AccessBankDetails,
  AccountLoginDetails,
  App,
  CustomerAccount,
  MAIL_SERVICE,
  RmqModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { AccessController } from './access.controller';
import { AccessLoginService } from './services/access-login';
import { GenerateAccessStatement } from './services/generate-statement';
import { RegenerateAccessStatement } from './services/regenerate-access-statement';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([CustomerAccount, App, AccountLoginDetails, AccessBankDetails]),
    EventEmitterModule.forRoot(),
    AccountModule,
    RmqModule,
  ],
  controllers: [AccessController],
  providers: [AccessLoginService, GenerateAccessStatement, RegenerateAccessStatement],
  exports: [AccessLoginService, GenerateAccessStatement, RegenerateAccessStatement],
})
export class AccessModule {}
