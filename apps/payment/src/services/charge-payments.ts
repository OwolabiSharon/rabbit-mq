import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import { PaymentTransaction, RmqService } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ChargeDto } from '../dto/charge.dto';
import { AddTransanctionDto } from '../dto/transaction.dto';
import { flw } from '../api/flw.api';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class PaymentChargeService {
  private readonly logger = new Logger(PaymentChargeService.name);
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepo: Repository<PaymentTransaction>,
    private rmqService: RmqService,
  ) {}
  async execute(chargeData: ChargeDto, transData: AddTransanctionDto, context: RmqContext) {
    try {
      const tx_ref = v4();
      const payload = new AddTransanctionDto().toEntity(transData);
      let data = {
        tx_ref,
        amount: chargeData.amount,
        currency: chargeData.currency,
        redirect_url: flw.redirect_url,
        narration: chargeData.narration,
        customer: {
          email: chargeData.email,
          phonenumber: chargeData.phone_number,
          name: chargeData.fullname,
        },
        customizations: flw.customizations,
      };

      const response = await axios.post(flw.url, data, {
        headers: flw.headers,
      });


      //Adding the transactions to the DB
      const transactionRecord = await this.transactionRepo.findOne({
        where: {
          business_id: payload.business_id,
        },
        order: { createdAt: 'DESC' },
      });

      if (transactionRecord) {
        payload.last_transaction_id = transactionRecord.id;
      }
      payload.trans_reference = tx_ref;
      await this.transactionRepo.save(payload);

      return response.data;
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw error;
    }
  }
}
