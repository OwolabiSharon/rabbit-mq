import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiCall } from './api_call.entity';
import { AppCustomer } from './app_customer';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { StatementPage } from './statement_page.entity';

@Entity('business_apps')
export class App extends BaseEntity {
  @Column({ type: 'varchar' })
  business_id: string;

  @Column({ type: 'varchar', nullable: true })
  old_id?: string;

  @Column({ type: 'varchar' })
  app_name: string;

  @Column({ type: 'varchar', array: true })
  account_type: string;

  @Column({ type: 'varchar' })
  product: string;

  @Column({ type: 'varchar' })
  public_key: string;

  @Column({ type: 'varchar' })
  private_key: string;

  @Column({ type: 'varchar' })
  sandbox_key: string;

  @Column({ type: 'varchar' })
  page_link: string;

  @Column({ type: 'varchar', nullable: true })
  send_notification_to: string;

  @Column({ type: 'varchar', nullable: true })
  webhook_url: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @ManyToOne(() => Business, (business) => business.app, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business?: Business;

  @OneToMany(() => ApiCall, (api_call) => api_call.app, { nullable: true })
  api_calls?: ApiCall[];

  @OneToMany(() => StatementPage, (statement_page) => statement_page.app, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'app_id' })
  statement_pages?: StatementPage[];

  @OneToMany(() => AppCustomer, (app_customer) => app_customer.app, {
    nullable: true,
  })
  customers?: AppCustomer[];
}
