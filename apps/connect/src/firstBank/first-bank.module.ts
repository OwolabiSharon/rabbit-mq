import { Module } from '@nestjs/common';
import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqModule } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { FirstBankController } from './first-bank.controller';
import { FirstBankLoginService } from './services/firstbank-login';
import { GenerateFirstBankStatement } from './services/firstbank-generate-statement';
import { RegenerateFirstBankStatement } from './services/regenerate-firstbank-statement';
import { FirstBankAuthProcess } from './services/firstbank-auth';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([CustomerAccount, App, AccountLoginDetails]),
    EventEmitterModule.forRoot(),
    AccountModule,
    RmqModule,
  ],
  controllers: [FirstBankController],
  providers: [
    FirstBankLoginService,
    GenerateFirstBankStatement,
    RegenerateFirstBankStatement,
    FirstBankAuthProcess,
  ],
  exports: [],
})
export class FirstBankModule {}
