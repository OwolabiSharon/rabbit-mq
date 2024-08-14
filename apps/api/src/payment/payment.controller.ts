import { CustomRequest } from '@app/common/utils/response';
import { Body, Controller, Get, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { ChargeDto } from 'apps/payment/src/dto/charge.dto';
import { AddTransanctionDto } from 'apps/payment/src/dto/transaction.dto';
import { PaymentClientService } from './payment.service';

@Controller('payment')
export class PaymentClientController {
  constructor(private readonly paymentClientService: PaymentClientService) {}
  @Post('charge')
  @HttpCode(200)
  async paymentCharge(@Body() chargeData: ChargeDto, @Body() transData: AddTransanctionDto) {
    const result = await this.paymentClientService.paymentCharge(chargeData, transData);
    return result;
  }

  @Post('response')
  @HttpCode(200)
  async paymentResponse(@Body() payload: any, @Headers('verif-hash') secretHash: string) {
    const result = await this.paymentClientService.paymentResponse(payload, secretHash);
    return result;
  }
}
