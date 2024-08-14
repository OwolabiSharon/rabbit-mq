import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { NG_KYC_BVN_ADVANCE } from '../ng_kyc_models/ng_kyc_bvn_advance';
import { LinkedAccount } from './linked_account.entity';
import { FinancialAnalysis } from "./financial_analysis.entity"
import { ApiCall } from '../api_call.entity';
import { BaseEntity } from '../base.entity';

 

@Entity("insights_user")
export class InsightsUser extends BaseEntity  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar'})
  name: string;

  @Column({unique: true,  type: 'varchar'})
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  bvn: string;

  @Column({unique: true,  type: 'varchar', nullable: true})
  zeeh_id: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: false })
  allow_data_access: boolean;

  @Column({ type: 'varchar', nullable: true })
  verification_token: string;

  @Column({ type: 'timestamptz', nullable: true })
  verification_token_expiration: Date;

  @Column({ type: 'timestamptz', nullable: true })
  verified_date: Date;

  @Column({ type: 'varchar', nullable: true })
  password_token: string;
  
  @Column({ type: 'timestamptz', nullable: true })
  password_token_expiration: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => NG_KYC_BVN_ADVANCE)
    @JoinColumn()
    bvn_info: NG_KYC_BVN_ADVANCE

  @OneToMany(() => FinancialAnalysis, (analytics) => analytics.user)
     analytics: FinancialAnalysis[]
  
  @OneToMany(() => ApiCall, (api_call) => api_call.user, { onDelete: 'SET NULL' })
  @JoinColumn({ referencedColumnName: 'user_id' })
  api_calls: ApiCall[]; 
} 