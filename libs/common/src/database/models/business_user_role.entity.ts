import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { Role } from './role.entity';

@Entity('business_user_roles')
export class BusinessRolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', enum: ['Pending', 'Active', 'Rejected'], default: 'Pending' })
  status: string;

  @Column({ type: 'date', nullable: true })
  invite_expiration_date: Date;

  @Column()
  role_id: string;

  @Column()
  business_id;

  @ManyToOne(() => Role, (role) => role.collaborator)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Business, (business) => business.collaborators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
