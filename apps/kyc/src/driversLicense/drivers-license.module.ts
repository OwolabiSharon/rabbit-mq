import { NG_KYC_DriverLicense, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversLicenseController } from './drivers-license.controller';
import { LicenseLookupService } from './services/license-lookup.service';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_DriverLicense]), RmqModule],
  controllers: [DriversLicenseController],
  providers: [LicenseLookupService],
})
export class DriversLicenseModule {}
