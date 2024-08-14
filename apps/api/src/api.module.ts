import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from '@app/common';
import { AppModule } from './app/app.module';
import { AccessClientModule } from './connect/access/access.module';
import { GtbClientModule } from './connect/gtb/gtb.module';
import { DatabaseModule, RmqModule } from '@app/common';
import { BvnClientModule } from './kyc/bvn/bvn.module';
import { CacClientModule } from './kyc/cac/cac.module';
import { DriversLicenseClientModule } from './kyc/driversLicense/drivers-license.module';
import { NubanClientModule } from './kyc/nuban/nuban.module';
import { PassportClientModule } from './kyc/passport/passport.module';
import { PhoneNumberClientModule } from './kyc/phoneNumber/phone-number.module';
import { SelfieClientsModule } from './kyc/selfie/selfie.module';
import { NinClientModule } from './kyc/nin/nin.module';
import { VinClientModule } from './kyc/vin/vin.module';
import { TinClientModule } from './kyc/tin/tin.module';
import { PaymentClientModule } from './payment/payment.module';
import { FcmbClientModule } from './connect/fcmb/fcmb.module';
import { FirstBankClientModule } from './connect/firstbank/firstbank.module';
import { BalanceModule } from './balance/balance.module';
import { StatementPageModule } from './statementPage/statement-page.module';
import { AccountClientModule } from './account/account.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    AppModule,
    RmqModule,
    AccessClientModule,
    GtbClientModule,
    FcmbClientModule,
    FirstBankClientModule,
    BvnClientModule,
    CacClientModule,
    DriversLicenseClientModule,
    NubanClientModule,
    PassportClientModule,
    PhoneNumberClientModule,
    SelfieClientsModule,
    NinClientModule,
    TinClientModule,
    VinClientModule,
    PaymentClientModule,
    BalanceModule,
    StatementPageModule,
    AccountClientModule,
  ],
})
export class ApiModule {}
