import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('access_bank_details')
export class AccessBankDetails extends BaseEntity {
  @Column({ type: 'varchar' })
  bw_instance: string;
  @Column({ type: 'varchar' })
  csrf_token: string;
  @Column({ type: 'varchar' })
  access_id: string;
  @Column({ type: 'varchar' })
  account_id: string;
}
