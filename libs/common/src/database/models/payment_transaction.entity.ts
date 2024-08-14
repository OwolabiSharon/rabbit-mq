import { Column, Entity, ManyToOne } from 'typeorm';
import { App } from './app.entity';
import { BaseEntity } from './base.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @Column({ type: 'uuid' })
  trans_reference: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  currency: string;

  @Column()
  email: string;

  @Column()
  narration: string;

  @Column({ default: 'pending' })
  transaction_status: string;

  @Column({})
  transaction_type: string;

  @Column({ type: 'uuid', nullable: true })
  last_transaction_id: string;
}
