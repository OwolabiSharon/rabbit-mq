import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test')
export class TestEntity extends BaseEntity {
  @Column()
  name: string;
}
