import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('unverified_business')
export class UnVerifiedBusiness {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar' })
  business_id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'varchar' })
  registration_number?: string;

  @Column({ type: 'text', nullable: true })
  registration_address?: string;

  @Column({ type: 'varchar' })
  country?: string;

  @Column({ type: 'varchar' })
  message?: string;

  @Column({ type: 'boolean', default: false })
  is_verified?: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived?: boolean;

  @ManyToOne(() => User, (user) => user.unverified_business, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
