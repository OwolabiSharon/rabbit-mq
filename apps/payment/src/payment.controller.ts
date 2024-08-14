import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaymentChargeService } from './services/charge-payments';
import { VerifyPaymentService } from './services/payment-response';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentChargeService: PaymentChargeService,
    private readonly verifyPaymentService: VerifyPaymentService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'payment-charge' })
  async paymentCharge(@Payload() data: any, @Ctx() context: RmqContext) {
    const { chargeData, transData } = data;
    const result = await this.paymentChargeService.execute(chargeData, transData, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'Payment initiated',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'payment-response' })
  async paymentResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    const { payload, secretHash } = data;
    const result = await this.verifyPaymentService.execute(payload, secretHash, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'success',
      code: 200,
      data: result,
    });
  }
}
