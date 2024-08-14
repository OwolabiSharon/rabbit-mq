import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { App } from './app.entity';
import { BaseEntity } from './base.entity';

@Entity('statement_pages')
export class StatementPage extends BaseEntity {
  @Column({ type: 'varchar' })
  page_name: string;
  @Column({ type: 'text', nullable: true })
  page_description: string;
  @Column({ type: 'varchar', nullable: false })
  period: string;

  @Column()
  app_id: string;

  @Column()
  business_id: string;

  @Column({ type: 'numeric', nullable: false })
  no_of_account: number;

  @ManyToOne(() => App, (app) => app.statement_pages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_id' })
  app: App;
}
