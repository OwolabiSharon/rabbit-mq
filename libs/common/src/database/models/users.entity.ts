import { Column, Entity, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { Token } from './token.entity';
import { UnVerifiedBusiness } from './unverified-business.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  old_id?: string;
  @Column({ type: 'varchar', nullable: true })
  pic?: string;
  @Column({ type: 'varchar' })
  first_name: string;
  @Column({ type: 'varchar' })
  last_name: string;
  @Column({ type: 'varchar' })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  phone_number: string;
  @Column({ type: 'varchar', default: 'ng' })
  country: string;
  @Column({ type: 'varchar' })
  password: string;
  @Column({ type: 'boolean', default: false })
  is_terms_agreement: boolean;
  @Column({ type: 'boolean', default: false })
  is_verified: boolean;
  @Column({ type: 'varchar', nullable: true })
  verification_token: string;
  @Column({ type: 'timestamptz', nullable: true })
  verification_token_expiration: Date;
  @Column({ type: 'timestamptz', nullable: true })
  verified_date: Date;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_login: Date;
  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;
  @Column({ type: 'boolean', default: false })
  is_admin: boolean;
  @Column({ type: 'varchar', nullable: true })
  password_token: string;
  @Column({ type: 'timestamptz', nullable: true })
  password_token_expiration: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updated_at: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Business, (business) => business.user, {
    cascade: ['insert', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'user_id' })
  business: Business[];

  @OneToMany(() => UnVerifiedBusiness, (unverified_business) => unverified_business.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'user_id' })
  unverified_business: Business;
}
