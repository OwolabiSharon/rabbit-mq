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
import { NUBAN_CHARGES } from 'apps/api/config';
import { NubanClientController } from './nuban.controller';
import { NubanClientService } from './nuban.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [NubanClientController],
  providers: [NubanClientService],
})
export class NubanClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(NUBAN_CHARGES)))
      .forRoutes('nuban/lookup/:public_key');
  }
}
