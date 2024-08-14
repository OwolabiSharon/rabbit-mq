import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('fcmb_bank_details')
export class FCMBBankDetails extends BaseEntity {
  @Column({ type: 'varchar' })
  customer_account_id: string;
}
