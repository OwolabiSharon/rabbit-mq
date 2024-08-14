import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_driver_license')
export class NG_KYC_DriverLicense {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  licenseNo: string;
  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  middleName: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  issuedDate: string;
  @Column({ nullable: true })
  expiryDate: string;
  @Column({ nullable: true })
  stateOfIssue: string;
  @Column({ nullable: true })
  birthDate: string;
  @Column({ type: 'text', nullable: true })
  photo: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
