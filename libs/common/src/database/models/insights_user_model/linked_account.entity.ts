import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne,
    OneToOne,
    JoinColumn,
} from "typeorm"
import { AccountLoginDetails } from "../bank_login_details"
import { BaseEntity } from "../base.entity"
import { FinancialAnalysis } from "./financial_analysis.entity"
import { InsightsUser } from "./insights_user.entity"

 
@Entity('linked_account')
export class LinkedAccount extends BaseEntity  {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    bank: string

    @OneToOne(() => AccountLoginDetails)
    @JoinColumn()
    login_details: AccountLoginDetails
    @JoinColumn()
    financial_analysis: FinancialAnalysis

    //@OneToOne(() => FinancialAnalysis)
}