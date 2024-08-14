import { PAYMENT_SERVICE } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChargeDto } from 'apps/payment/src/dto/charge.dto';
import { AddTransanctionDto } from 'apps/payment/src/dto/transaction.dto';

@Injectable()
export class PaymentClientService {
  private readonly logger = new Logger(PaymentClientService.name);
  constructor(@Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy) {}

  async paymentCharge(chargeData: ChargeDto, transData: AddTransanctionDto) {
    try {
      return this.paymentClient.send({ cmd: 'payment-charge' }, { chargeData, transData });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async paymentResponse(payload: any, secretHash: string) {
    try {
      return this.paymentClient.send({ cmd: 'payment-response' }, { payload, secretHash });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
