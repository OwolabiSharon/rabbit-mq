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
import { NIN_CHARGES, SELFIE_NIN_CHARGES } from 'apps/api/config';
import { NinClientController } from './nin.controller';
import { NinClientService } from './nin.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [NinClientController],
  providers: [NinClientService],
})
export class NinClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(NIN_CHARGES)))
      .forRoutes('nin/lookup/:public_key')
      .apply(AuthMiddlewareCreator(Number(SELFIE_NIN_CHARGES)))
      .forRoutes('nin/selfie-nin/:public_key');
  }
}
