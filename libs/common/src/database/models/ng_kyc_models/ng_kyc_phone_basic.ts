import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ng_kyc_phone_basic')
export class NG_KYC_Phone_Basic {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  middlename: string;
  @Column({ type: 'varchar' })
  phoneNumber: string;
  @Column({ nullable: true })
  surname: string;
  @Column({ nullable: true })
  birthstate: string;
  @Column({ nullable: true })
  firstname: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
