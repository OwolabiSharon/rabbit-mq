import { PAYMENT_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { PaymentClientController } from './payment.controller';
import { PaymentClientService } from './payment.service';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [PaymentClientController],
  providers: [PaymentClientService],
})
export class PaymentClientModule {}
