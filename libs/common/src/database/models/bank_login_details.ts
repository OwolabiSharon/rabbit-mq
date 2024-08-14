import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerAccount } from './customers_accounts.entity';

@Entity('account_login_details')
export class AccountLoginDetails extends BaseEntity {
  @Column({ type: 'varchar' })
  login_id: string;

  @Column()
  account_id: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => CustomerAccount, (account) => account.login_details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: CustomerAccount;
}
