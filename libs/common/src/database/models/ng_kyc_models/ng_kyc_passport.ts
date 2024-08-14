import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_passport')
export class NG_KYC_Passport {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  middle_name: string;
  @Column({ nullable: true })
  dob: string;
  @Column({ nullable: true })
  mobile: string;
  @Column({ type: 'text', nullable: true })
  photo: string;
  @Column({ type: 'text', nullable: true })
  signature: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  issued_at: string;
  @Column({ nullable: true })
  issued_date: string;
  @Column({ nullable: true })
  expiry_date: string;
  @Column({ nullable: true })
  reference_id: string;
  @Column({ nullable: true })
  passport_number: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
