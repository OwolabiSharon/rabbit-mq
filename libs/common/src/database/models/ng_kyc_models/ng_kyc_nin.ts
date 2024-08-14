import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_nin')
export class NG_KYC_NIN {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  birthcountry: string;
  @Column({ nullable: true })
  birthdate: string;
  @Column({ nullable: true })
  birthlga: string;
  @Column({ nullable: true })
  birthstate: string;
  @Column({ nullable: true })
  centralID: string;
  @Column({ nullable: true })
  educationallevel: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  employmentstatus: string;
  @Column({ nullable: true })
  firstname: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  heigth: string;
  @Column({ nullable: true })
  maritalstatus: string;
  @Column({ nullable: true })
  nin: string;
  @Column({ nullable: true })
  nok_address1: string;
  @Column({ nullable: true })
  nok_address2: string;
  @Column({ nullable: true })
  nok_firstname: string;
  @Column({ nullable: true })
  nok_lga: string;
  @Column({ nullable: true })
  nok_middlename: string;
  @Column({ nullable: true })
  nok_postalcode: string;
  @Column({ nullable: true })
  nok_state: string;
  @Column({ nullable: true })
  nok_surname: string;
  @Column({ nullable: true })
  nok_town: string;
  @Column({ nullable: true })
  nspokenlang: string;
  @Column({ nullable: true })
  ospokenlang: string;
  @Column({ nullable: true })
  pfirstname: string;
  @Column({ type: 'text', nullable: true })
  photo: string;
  @Column({ nullable: true })
  pmiddlename: string;
  @Column({ nullable: true })
  profession: string;
  @Column({ nullable: true })
  psurname: string;
  @Column({ nullable: true })
  religion: string;
  @Column({ nullable: true })
  residence_AdressLine1: string;
  @Column({ nullable: true })
  residence_Town: string;
  @Column({ nullable: true })
  residence_lga: string;
  @Column({ nullable: true })
  residence_state: string;
  @Column({ nullable: true })
  residencestatus: string;
  @Column({ nullable: true })
  self_origin_lga: string;
  @Column({ nullable: true })
  self_origin_place: string;
  @Column({ nullable: true })
  self_origin_state: string;
  @Column({ type: 'text', nullable: true })
  signature: string;
  @Column({ nullable: true })
  surname: string;
  @Column({ nullable: true })
  telephoneno: string;
  @Column({ nullable: true })
  title: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
