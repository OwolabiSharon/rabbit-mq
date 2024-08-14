import { ApiCall, Business, BusinessRolesEntity, User } from '@app/common';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { Injectable, UnprocessableEntityException, Logger } from '@nestjs/common';;
import { randomBytes } from 'crypto';
import { generateAnalytics } from '../api/periculum-analytics'
import { generateStatement } from '../api/connect'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { FinancialAnalysis } from '@app/common/database/models/insights_user_model/financial_analysis.entity';
import { BadRequestException} from '@nestjs/common';
import { GenerateAnalytics } from '../dto/generate-analysis';




@Injectable()
export class ConnectService {
 
  constructor(
    @InjectRepository(InsightsUser)
    private readonly insightsRepo: Repository<InsightsUser> ,

    @InjectRepository(FinancialAnalysis)
    private readonly financialAnalysis: Repository<FinancialAnalysis> ,

    @InjectRepository(ApiCall)
    private readonly apiRepo: Repository<ApiCall>,

  ) {}

  async getFinancialAnalytics(data: any){
    try {
      const user = await this.insightsRepo.findOne(
        { where:
            {email: data.email}
        }
      );
      if (user) {
        
      const statementData = await generateStatement();

      var id = 0
      const newStatementFormat = statementData.data.data.map(item => {
          id++
          return {
            _id: id.toString(),
            type: item.type,
            amount: item.amount * 100,
            narration: item.narration,
            date: new Date(item.date).toISOString(),
            balance: item.closingBalance * 100
          };
        });

      var monoStatement = {
        "meta": {
            "count": statementData.data.meta.count
        },
        "data":newStatementFormat
      }

      const analytics_data = await generateAnalytics(data.statementName,monoStatement);
      console.log(analytics_data);
      
      const analytics = await this.financialAnalysis.save({
        ...analytics_data,
        accountID: statementData.accountId,
        user,
    });

    if (!analytics) {
      throw new BadRequestException("data not saved to databse successfully");
    } else {
      const api = await this.apiRepo.save({
        endpoint: "generateFinancialAnalytics",
        user_id: user.id ,
        charge: 40,
        source: "Insight",
        status: "success"
      });
      return analytics
    }
      } else {
        throw new BadRequestException("User not found");
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async fetchAnalytics(data: any){
    try {
      const user = await this.insightsRepo.findOne(
        { where:
            {zeeh_id:data.zeeh_id},
          relations: {
            analytics: true,
          }
        }
      );
      if (user) {
        const api = await this.apiRepo.save({
          endpoint: "fetchAnalytics",
          user_id: user.id ,
          charge: 40,
          source: "Insight",
          status: "success"
        });
        return user.analytics
      } else {
        throw new BadRequestException("Could'nt Fetch Data");
      }
      
      

    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async toggleDataAccess(data: any){
    const userRecord = await this.insightsRepo.findOne({
      where: { email: data.email },
    });
    if (userRecord) {
      userRecord.allow_data_access = !userRecord.allow_data_access
        await this.insightsRepo.save(userRecord);
      }
      return userRecord
    }
 
  async getCashFlowAnalysis(data: any){
    const user = await this.insightsRepo.findOne(
      { where:
          {zeeh_id:data.zeeh_id},
        relations: {
          analytics: true,
        }
      }
    );
    const use = await this.financialAnalysis.find()
    use[0].user = user
    const users2 = await this.financialAnalysis.save(use[0])
    if (user) {
      if (user.analytics.length > 0) {
        const api = await this.apiRepo.save({
            endpoint: "getCashFlowAnalysis",
            user_id: user.id ,
            charge: 40,
            source: "Insight",
            status: "success"
          });
      
        return user.analytics[0].cashFlowAnalysis
      } else {
        throw new BadRequestException("user has no financial analysis");
      }
    } else {
        const users = await this.insightsRepo.find()
        console.log(users);
        
      throw new BadRequestException("Could'nt Fetch Data");
    }
}
}