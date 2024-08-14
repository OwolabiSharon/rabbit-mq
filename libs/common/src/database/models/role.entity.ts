import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { BusinessRolesEntity } from './business_user_role.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar' })
  user_type: string;

  @Column()
  business_id: string;

  @Column({ type: 'varchar', nullable: true })
  old_id?: string;

  @Column('text', { array: true })
  permissions: string[];

  @ManyToOne(() => Business, (business) => business.role, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business?: Business;

  @OneToMany(() => BusinessRolesEntity, (collaborator) => collaborator.role)
  @JoinColumn({ referencedColumnName: 'role_id' })
  collaborator?: BusinessRolesEntity;
}
