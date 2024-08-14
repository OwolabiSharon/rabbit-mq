import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';

@Entity('user_tokens')
export class Token extends BaseEntity {
  @Column({ type: 'varchar' })
  refresh_token: string;
  @Column({ type: 'varchar' })
  user_agent: string;
  @Column({ type: 'boolean', default: false })
  is_valid: boolean;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
