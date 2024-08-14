import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { App } from './app.entity';
import { BaseEntity } from './base.entity';
import { CustomerAccount } from './customers_accounts.entity';

@Entity('app_customers')
export class AppCustomer extends BaseEntity {
  @Column({ type: 'varchar' })
  user_reference: string;
  @Column({ type: 'text', nullable: true })
  email: string;
  @Column({ type: 'text', nullable: true })
  full_name: string;

  @ManyToOne(() => App, (app) => app.customers)
  app: App;

  @OneToMany(
    () => CustomerAccount,
    (customer_account) => customer_account.customer,
  )
  accounts: CustomerAccount[];
}
