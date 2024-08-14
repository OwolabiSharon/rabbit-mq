import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_vin')
export class NG_KYC_VIN {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  vin: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  occupation: string;

  @Column({ type: 'varchar', nullable: true })
  timeOfRegistration: Date;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  lga: string;

  @Column({ type: 'varchar', nullable: true })
  registrationAreaWard: string;

  @Column({ type: 'varchar', nullable: true })
  pollingUnit: string;

  @Column({ type: 'varchar', nullable: true })
  date_of_birth: string;

  @Column({ type: 'varchar', nullable: true })
  reference: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
