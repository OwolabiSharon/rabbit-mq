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
import { CAC_CHARGES, CAC_SHAREHOLDER } from 'apps/api/config';
import { CacClientController } from './cac.controller';
import { CacClientService } from './cac.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [CacClientController],
  providers: [CacClientService],
})
export class CacClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(CAC_CHARGES)))
      .forRoutes('cac/cac-basic/:public_key')
      .apply(AuthMiddlewareCreator(Number(CAC_SHAREHOLDER)))
      .forRoutes('cac/cac-advance/:public_key');
  }
}
