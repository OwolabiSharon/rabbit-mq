import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_tin')
export class NG_KYC_TIN {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ type: 'varchar', nullable: true })
  tin: string;

  @Column({ type: 'varchar', nullable: true })
  taxpayer_name: string;

  @Column({ type: 'varchar', nullable: true })
  cac_reg_number: string;

  @Column({ type: 'varchar', nullable: true })
  firstin: string;

  @Column({ type: 'varchar', nullable: true })
  jittin: string;

  @Column({ type: 'varchar', nullable: true })
  tax_office: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone_number: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
