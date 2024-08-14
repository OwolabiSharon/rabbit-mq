import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_bvn_basic')
export class NG_KYC_BVN_BASIC {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  bvn: string;
  @Column({ type: 'varchar' })
  phoneNumber1: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  dateOfBirth: string;
  @Column({ nullable: true })
  firstName: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
