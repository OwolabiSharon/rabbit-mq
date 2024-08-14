import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AppCustomer } from './app_customer';
import { AccountLoginDetails } from './bank_login_details';
import { BaseEntity } from './base.entity';
import { FCMBBankDetails, AccessBankDetails } from './bank_specific_models';

@Entity('customers_accounts')
export class CustomerAccount extends BaseEntity {
  @Column()
  account_no: string;
  @Column({ type: 'varchar', nullable: true })
  old_id?: string;
  @Column({ nullable: true })
  user_reference: string;
  @Column()
  device_id: string;
  @Column({ nullable: true })
  customer_account_id: string;
  @Column()
  business_id: string;
  @Column()
  bank_name: string;
  @Column()
  bank_logo: string;
  @Column()
  bank_code: string;
  @Column()
  bvn: string;
  @Column()
  public_key: string;
  @Column()
  session_id: string;
  @Column({ type: 'timestamptz' })
  session_exp: Date;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;
  @Column()
  full_name: string;
  @Column()
  balance: string;
  @Column({ type: 'timestamptz', nullable: true })
  dob: Date;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  marital_status: string;
  @Column()
  country: string;
  @Column({ nullable: true }) //nin for nigeria
  id_number: string;
  @Column({ type: 'timestamptz', nullable: true })
  statement_date: Date;
  @Column({ nullable: true })
  statement_length: number;
  @Column()
  account_type: string;
  @Column({ nullable: true })
  account_status: string;
  @Column()
  currency: string;
  @Column({ nullable: true })
  transaction_history_file_path: string;
  @Column({ type: 'boolean', nullable: true })
  active: boolean;
  @Column({ type: 'timestamptz' })
  last_login: Date;

  @ManyToOne(() => AppCustomer, (app_customer) => app_customer.accounts)
  customer: AppCustomer;

  @OneToOne(() => AccountLoginDetails, (login_details) => login_details.account)
  @JoinColumn({ referencedColumnName: 'account_id' })
  login_details: AccountLoginDetails;
  //bank specific
  @OneToOne(() => AccessBankDetails, { nullable: true })
  @JoinColumn()
  access_bank_details: AccessBankDetails;
  @OneToOne(() => FCMBBankDetails, { nullable: true })
  @JoinColumn()
  fcmb_bank_details: FCMBBankDetails;
}
