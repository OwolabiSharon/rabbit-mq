import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { BaseEntity } from '../base.entity';
  import { InsightsUser } from "./insights_user.entity"

  
  
  
  @Entity('financial_analysis')
  export class FinancialAnalysis extends BaseEntity  {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({type: 'varchar'})
    accountID: string;

    @Column({type: 'varchar', nullable: true})
    name: string;
  
    @Column({ type: 'varchar' })
    source: string;

    @Column({ type: 'varchar' })
    clientFullName: string;
  
    @Column({ type: 'int'})
    clientPhoneNumber: number;
  
    @Column({type: 'varchar'})
    accountType: string;

    @Column({type: 'numeric'})
    accountBalance: string;

    @Column({type: 'varchar'})
    accountName: string;

    @Column({type: 'varchar'})
    bankName: string;

    @Column({type: 'varchar'})
    statementType: string;

    @Column({type: 'timestamptz'})
    startDate: Date;

    @Column({type: 'timestamptz'})
    endDate: Date;

    @Column({type: 'timestamptz'})
    createdDate: Date;

    @Column({type: 'varchar', nullable: true})
    processingStatus: string;

    @Column({type: 'jsonb', array: false,default: () => "'[]'", nullable: true})
    clientIdentification: object[];
  
    @Column({ type: 'json'})
    spendAnalysis: Object;

    @Column({ type: 'json'})
    transactionPatternAnalysis: Object;

    @Column({ type: 'json'})
    behavioralAnalysis: Object;

    @Column({ type: 'json'})
    cashFlowAnalysis: Object;

    @Column({ type: 'json'})
    incomeAnalysis: Object;
  
    @CreateDateColumn()
    createdAt: Date;
  
    // @OneToOne(() => NG_KYC_BVN_ADVANCE)
    //   @JoinColumn()
    //   bvn_info: NG_KYC_BVN_ADVANCE
  
    // @OneToMany(() => Linked_account, (linked_account) => linked_account.user)
    // linked_account: Linked_account[]

    @ManyToOne(() => InsightsUser, (user) => user.analytics)
    user: InsightsUser
    
  
  } 