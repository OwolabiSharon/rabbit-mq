import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { App } from './app.entity';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { InsightsUser } from './insights_user_model/insights_user.entity';

@Entity('api_calls')
export class ApiCall extends BaseEntity {
  @Column({ type: 'varchar' })
  endpoint: string;

  @Column({ type: 'text', nullable: false, enum: ['success', 'failed'] })
  status: string;

  @Column({ type: 'numeric', nullable: false })
  charge: number;

  @Column({ type: 'text', nullable: false, enum: ['Dashboard', 'Api', 'Insight'] })
  source: string;

  @Column({nullable:true})
  business_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => App, (app) => app.api_calls)
  app: App;

  @ManyToOne(() => Business, (business) => business.api_calls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => InsightsUser, (user) => user.api_calls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: InsightsUser;
}
