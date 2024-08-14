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
import { VIN_CHARGES } from 'apps/api/config';
import { VinClientController } from './vin.controller';
import { VinClientService } from './vin.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [VinClientController],
  providers: [VinClientService],
})
export class VinClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddlewareCreator(Number(VIN_CHARGES))).forRoutes('vin/lookup/:public_key');
  }
}
