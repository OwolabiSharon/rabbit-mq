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
import { PASSPORT_CHARGES } from 'apps/api/config';
import { PassportClientController } from './passport.controller';
import { PassportClientService } from './passport.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [PassportClientController],
  providers: [PassportClientService],
})
export class PassportClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(PASSPORT_CHARGES)))
      .forRoutes('passport/lookup/:public_key');
  }
}
