import {
  App,
  AuthMiddlewareCreator,
  Business,
  CustomerAccount,
  KYC_SERVICE,
  RmqModule,
} from '@app/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SELFIE_CHARGES } from 'apps/api/config';
import { SelfieClientController } from './selfie.controller';
import { SelfieClientService } from './selfie.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [SelfieClientController],
  providers: [SelfieClientService],
})
export class SelfieClientsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(SELFIE_CHARGES)))
      .forRoutes('selfie/lookup/:public_key');
  }
}
