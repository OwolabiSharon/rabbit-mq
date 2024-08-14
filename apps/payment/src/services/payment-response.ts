import {
  Business,
  ConflictErrorException,
  ForbiddenErrorException,
  PaymentTransaction,
  RmqService,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FLUTTERWAVE_PUBLIC_KEY,
  FLUTTERWAVE_SECRET_KEY,
  FLUTTERWAVE_WEBHOOK_HASH,
} from 'apps/payment/config';
import { Repository } from 'typeorm';
import { VerifyPaymentDto } from '../dto/transaction.dto';
const Flutterwave = require('flutterwave-node-v3');

@Injectable()
export class VerifyPaymentService {
  private readonly logger = new Logger(VerifyPaymentService.name);
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepo: Repository<PaymentTransaction>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    private rmqService: RmqService,
  ) {}
  flw = new Flutterwave(FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY);
  async execute(payload: any, secretHash: string, context: RmqContext) {
    try {
      if (secretHash !== FLUTTERWAVE_WEBHOOK_HASH) {
        throw new ForbiddenErrorException('error verifying hash');
      }
      //checking duplicate transaction conflict
      const transactionRecord = await this.transactionRepo.findOne({
        where: {
          trans_reference: payload.data.tx_ref,
        },
      });

      if (transactionRecord.transaction_status === payload.data.status) {
        throw new ConflictErrorException('Duplicate Transaction');
      }

      //Verifying Transaction status
      const response = await this.flw.Transaction.verify({
        id: payload.data.id,
      });

      if (
        response.data.status === 'successful' &&
        response.data.amount === transactionRecord.amount
      ) {
        //updating transaction status in DB
        const payload2 = new VerifyPaymentDto().updateEntity(response.data);
        payload2.transaction_status = payload.data.status;
        const id = transactionRecord.id;
        const business = await this.businessRepo.findOne({
          where: { id: transactionRecord.business_id },
        });
        const balance = business.balance + response.data.amount;
        await this.transactionRepo.update(id, payload2);
        await this.businessRepo.update({ id: business.id }, { balance });
        return response.data.status;
      }
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
    }
  }
}
