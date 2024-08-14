import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('hello_world')
export class HelloWorld extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'text', nullable: true })
  message: string;
}
