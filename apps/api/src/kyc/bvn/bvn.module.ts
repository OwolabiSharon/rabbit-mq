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
import { BVN_BASIC_CHARGES, BVN_CHARGES, SELFIE_BVN_CHARGES } from 'apps/api/config';
import { BvnClientController } from './bvn.controller';
import { BvnClientService } from './bvn.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [BvnClientController],
  providers: [BvnClientService],
}) 
export class BvnClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(BVN_BASIC_CHARGES)))
      .forRoutes('bvn/bvn-basic/:public_key')
      .apply(AuthMiddlewareCreator(Number(BVN_CHARGES)))
      .forRoutes('bvn/bvn-advance/:public_key')
      .apply(AuthMiddlewareCreator(Number(SELFIE_BVN_CHARGES)))
      .forRoutes('bvn/selfie-bvn/:public_key');
  }
}
