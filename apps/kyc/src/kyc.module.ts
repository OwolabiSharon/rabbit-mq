import { Module } from '@nestjs/common';
import { DatabaseModule, RmqModule, SaveApiCallModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NinModule } from './nin/nin.module';
import { BvnModule } from './bvn/bvn.module';
import { DriversLicenseModule } from './driversLicense/drivers-license.module';
import { CacModule } from './cac/cac.module';
import { PassportModule } from './passport/passport.module';
import { PhoneNumberModule } from './phoneNumber/phone-number.module';
import { SelfieModule } from './selfie/selfie.module';
import { TinModule } from './tin/tin.module';
import { VinModule } from './vin/vin.module';
import { NubanModule } from './nuban/nuban.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_KYC_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
    DatabaseModule,
    NinModule,
    BvnModule,
    DriversLicenseModule,
    CacModule,
    PassportModule,
    PhoneNumberModule,
    SelfieModule,
    TinModule,
    VinModule,
    NubanModule,
    SaveApiCallModule,
  ],
})
export class KycModule {}
