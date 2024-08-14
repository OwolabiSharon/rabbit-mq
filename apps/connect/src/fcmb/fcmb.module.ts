import { Module } from '@nestjs/common';
import { AccountLoginDetails, App, CustomerAccount, MAIL_SERVICE, RmqModule } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { FcmbController } from './fcmb.controller';
import { FcmbLoginService } from './services/fcmb-login';
import { GenerateFcmbStatement } from './services/generate-statement';
import { RegenerateFcmbStatement } from './services/regenerate-fcmb-statement';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([CustomerAccount, App, AccountLoginDetails]),
    EventEmitterModule.forRoot(),
    AccountModule,
    RmqModule,
  ],
  controllers: [FcmbController],
  providers: [FcmbLoginService, GenerateFcmbStatement, RegenerateFcmbStatement],
  exports: [],
})
export class FcmbModule {}
