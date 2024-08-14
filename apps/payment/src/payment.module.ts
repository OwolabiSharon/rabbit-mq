import { Business, DatabaseModule, PaymentTransaction, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PaymentController } from './payment.controller';
import { PaymentChargeService } from './services/charge-payments';
import { VerifyPaymentService } from './services/payment-response';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([PaymentTransaction, Business]),
    DatabaseModule,
    RmqModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentChargeService, VerifyPaymentService],
})
export class PaymentModule {}
