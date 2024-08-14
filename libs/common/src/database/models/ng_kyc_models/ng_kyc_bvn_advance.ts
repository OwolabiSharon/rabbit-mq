import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_bvn_advance')
export class NG_KYC_BVN_ADVANCE {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ type: 'varchar', nullable: true })
  firstName: string;
  @Column({ type: 'varchar', nullable: true })
  middleName: string;
  @Column({ type: 'varchar', nullable: true })
  lastName: string;
  @Column({ type: 'varchar', nullable: true })
  dateOfBirth: string;
  @Column({ type: 'varchar', nullable: true })
  phoneNumber1: string;
  @Column({ type: 'varchar', nullable: true })
  phoneNumber2: string;
  @Column({ type: 'varchar', nullable: true })
  registrationDate: string;
  @Column({ type: 'varchar', nullable: true })
  enrollmentBank: string;
  @Column({ type: 'varchar', nullable: true })
  enrollmentBranch: string;
  @Column({ type: 'varchar', nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  gender: string;
  @Column({ type: 'varchar', nullable: true })
  levelOfAccount: string;
  @Column({ type: 'varchar', nullable: true })
  lgaOfOrigin: string;
  @Column({ type: 'varchar', nullable: true })
  lgaOfResidence: string;
  @Column({ type: 'varchar', nullable: true })
  maritalStatus: string;
  @Column({ type: 'varchar', nullable: true })
  nin: string;
  @Column({ type: 'varchar', nullable: true })
  nameOnCard: string;
  @Column({ type: 'varchar', nullable: true })
  nationality: string;
  @Column({ type: 'varchar', nullable: true })
  residentialAddress: string;
  @Column({ type: 'varchar', nullable: true })
  stateOfOrigin: string;
  @Column({ type: 'varchar', nullable: true })
  stateOfResidence: string;
  @Column({ type: 'varchar', nullable: true })
  title: string;
  @Column({ type: 'varchar', nullable: true })
  watchListed: string;
  @Column({ type: 'varchar', nullable: true })
  bvn: string;
  @Column({ type: 'text', nullable: true })
  base64Image: string;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
