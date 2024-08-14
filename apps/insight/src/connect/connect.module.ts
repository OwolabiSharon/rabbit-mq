import  { MiddlewareConsumer, Module, NestModule, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { LinkedAccount } from '@app/common/database/models/insights_user_model/linked_account.entity';
import { FinancialAnalysis } from '@app/common/database/models/insights_user_model/financial_analysis.entity';
import { ConnectService } from './services/connect.service';
import { ConnectController } from './controllers/connect.controller';
import { ApiCall } from '@app/common';



    
@Global()
@Module({
    imports:[
        TypeOrmModule.forFeature([InsightsUser, LinkedAccount,FinancialAnalysis, ApiCall ]),
    ],
    providers: [
        ConnectService
    ],
    controllers: [
        ConnectController
    ]
})
export class InsightConnectModule{}