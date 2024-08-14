import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_nuban')
export class NG_KYC_NUBAN {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  account_currency: string;
  @Column({ nullable: true })
  account_name: string;
  @Column({ nullable: true })
  account_number: string;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  other_names: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  account_type: string;
  @Column({ nullable: true })
  address_1: string;
  @Column({ nullable: true })
  address_2: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  postal_code: string;
  @Column({ nullable: true })
  state_code: string;
  @Column({ nullable: true })
  country_code: string;
  @Column({ nullable: true })
  nationality: string;
  @Column({ nullable: true })
  country_of_birth: string;
  @Column({ nullable: true })
  country_of_issue: string;
  @Column({ nullable: true })
  dob: string;
  @Column({ nullable: true })
  expiry_date: string;
  @Column({ nullable: true })
  identity_number: string;
  @Column({ nullable: true })
  identity_type: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
