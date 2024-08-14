import { Module } from '@nestjs/common';
import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqModule } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { GtbController } from './gtb.controller';
import { GtbLoginService } from './services/gtb-login';
import { GenerateGtbTransactionService } from './services/gtb-generate-transaction';
import { RegenerateGtbTransaction } from './services/regenerate-gtb-transaction';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([CustomerAccount, App, AccountLoginDetails]),
    EventEmitterModule.forRoot(),
    AccountModule,
    RmqModule,
  ],
  controllers: [GtbController],
  providers: [GtbLoginService, GenerateGtbTransactionService, RegenerateGtbTransaction],
  exports: [],
})
export class GtbModule {}
