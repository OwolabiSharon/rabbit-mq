import {
  App,
  AuthMiddlewareCreator,
  Business,
  CustomerAccount,
  KYC_SERVICE,
  RmqModule,
} from '@app/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADVANCED_PHONE_CHARGES, BASIC_PHONE_CHARGES } from 'apps/api/config';
import { PhoneNumberClientController } from './phone-number.controller';
import { PhoneNumberClientService } from './phone-number.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [PhoneNumberClientController],
  providers: [PhoneNumberClientService],
})
export class PhoneNumberClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(BASIC_PHONE_CHARGES)))
      .forRoutes('phone/phone-basic/:public_key')
      .apply(AuthMiddlewareCreator(Number(ADVANCED_PHONE_CHARGES)))
      .forRoutes('phone/phone-advance/:public_key');
  }
}
