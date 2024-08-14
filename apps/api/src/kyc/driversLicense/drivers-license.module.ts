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
import { DRIVER_LICENSE } from 'apps/api/config';
import { DriverLicenseClientController } from './drivers-license.controller';
import { DriversLicenseClientService } from './drivers-license.service';

@Module({
  imports: [
    RmqModule.register({ name: KYC_SERVICE }),
    TypeOrmModule.forFeature([App, CustomerAccount, Business]),
  ],
  controllers: [DriverLicenseClientController],
  providers: [DriversLicenseClientService],
})
export class DriversLicenseClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareCreator(Number(DRIVER_LICENSE)))
      .forRoutes('drivers-license/lookup/:public_key');
  }
}
