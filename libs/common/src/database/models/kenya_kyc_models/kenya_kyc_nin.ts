import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kenya_kyc_nin')
export class KENYA_KYC_NIN {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  completename: string;
  @Column({ nullable: true })
  formofaddress: string;
  @Column({ nullable: true })
  qualificationpreceding: string;
  @Column({ nullable: true })
  givenfullname: string;
  @Column({ nullable: true })
  givennameinitials: string;
  @Column({ nullable: true })
  qualification_int_first: string;
  @Column({ nullable: true })
  surname_prefix_first: string;
  @Column({ nullable: true })
  surname_first: string;
  @Column({ nullable: true })
  indicator: string;
  @Column({ nullable: true })
  qualification_int_second: string;
  @Column({ nullable: true })
  surname_prefix_second: string;
  @Column({ nullable: true })
  qualification_suceeding: string;
  @Column({ nullable: true })
  nin: string;
  @Column({ nullable: true })
  name_qualified: string;
  @Column({ nullable: true })
  function: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  nationality: string;
  @Column({ nullable: true })
  nationalid: string;
  @Column({ nullable: true })
  organization_name: string;
  @Column({ nullable: true })
  dob: string;
  @Column({ nullable: true })
  businessid: string;
  @Column({ nullable: true })
  contact_type: string;
  @Column({ nullable: true })
  countryCode: string;
  @Column({ nullable: true })
  contactType: string;
  @Column({ nullable: true })
  nameQualified: string;
  @Column({ type: 'text', nullable: true })
  organizationName: string;
  @Column({ nullable: true })
  qualificationIntFirst: string;
  @Column({ nullable: true })
  qualificationIntSecond: string;
  @Column({ nullable: true })
  qualificationSuceeding: string;
  @Column({ nullable: true })
  surnameFirst: string;
  @Column({ nullable: true })
  surnamePrefixFirst: string;
  @Column({ nullable: true })
  surnamePrefixSecond: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
