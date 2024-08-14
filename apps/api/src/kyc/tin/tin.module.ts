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
import { TIN_CHARGES } from 'apps/api/config';
import { TinController } from 'apps/kyc/src/tin/tin.controller';
import { TinClientController } from './tin.controller';
import { TinClientService } from './tin.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [TinClientController],
  providers: [TinClientService],
})
export class TinClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddlewareCreator(Number(TIN_CHARGES))).forRoutes('tin/lookup/:public_key');
  }
}
