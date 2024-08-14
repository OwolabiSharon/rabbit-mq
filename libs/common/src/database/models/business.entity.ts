import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiCall } from './api_call.entity';
import { App } from './app.entity';
import { BusinessRolesEntity } from './business_user_role.entity';
import { Role } from './role.entity';
import { User } from './users.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar', nullable: true})
  old_id?: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  registration_number?: string;

  @Column({ type: 'text', nullable: true })
  registration_address?: string;

  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'numeric', nullable: true })
  balance?: number;

  @Column({ type: 'varchar', nullable: true })
  currency?: string;

  @Column({ type: 'varchar', nullable: true })
  state?: string;

  @Column({ type: 'varchar', nullable: true })
  business_process?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: false })
  is_business_verified?: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  verified_date?: Date;

  @Column({ type: 'varchar', nullable: true, default: '' })
  business_logo?: string;

  @Column({ type: 'boolean', default: false })
  is_balance_funded?: boolean;

  @Column({ type: 'varchar', default: 'ng' })
  country?: string;

  @ManyToOne(() => User, (user) => user.business, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => App, (app) => app.business)
  @JoinColumn({ referencedColumnName: 'business_id' })
  app?: App[];

  @OneToMany(() => ApiCall, (api_call) => api_call.business, { onDelete: 'SET NULL' })
  @JoinColumn({ referencedColumnName: 'business_id' })
  api_calls?: ApiCall[];

  @OneToMany(() => BusinessRolesEntity, (collaborator) => collaborator.business, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'business_id' })
  collaborators?: BusinessRolesEntity[];

  @OneToMany(() => Role, (role) => role.business)
  @JoinColumn({ referencedColumnName: 'business_id' })
  role?: Role[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
