import  { MiddlewareConsumer, Module, NestModule, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import {JwtModule} from "@nestjs/jwt";
import { LinkedAccount } from '@app/common/database/models/insights_user_model/linked_account.entity';
import { NG_KYC_BVN_ADVANCE } from '@app/common';
import { Password } from './controllers/password.controller';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { BVN_BASIC_CHARGES, BVN_CHARGES, SELFIE_BVN_CHARGES } from 'apps/api/config';
import {
    App,
    AuthMiddlewareCreator,
    Business,
    CustomerAccount,
    KYC_SERVICE,
    RmqModule,
    MAIL_SERVICE
  } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserVerificationMail } from 'apps/auth/src/helpers/mails/user-verification.mail';
import { ForgotPasswordMail } from 'apps/auth/src/helpers/mails/forgot-password';
import { Verify_email } from './controllers/verify-email.controller';
import { VerifyEmailService } from './services/verify-email';
import { FinancialAnalysis } from '@app/common/database/models/insights_user_model/financial_analysis.entity';



    
@Global()
@Module({
    imports:[
        TypeOrmModule.forFeature([InsightsUser, LinkedAccount, NG_KYC_BVN_ADVANCE, FinancialAnalysis]),
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        }),
        RmqModule.register({ name: KYC_SERVICE }),
        RmqModule.register({ name: MAIL_SERVICE }),
        TypeOrmModule.forFeature([App, CustomerAccount, Business]),
        EventEmitterModule.forRoot(),
    ],
    providers: [
        AuthService,
        UserVerificationMail,
        ForgotPasswordMail,
        ForgotPasswordService,
        ResetPasswordService,
        VerifyEmailService
    ],
    controllers: [
        AuthController,
        Password,
        Verify_email
    ]
})
export class InsightAuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddlewareCreator(Number(BVN_CHARGES)))
        .forRoutes('auth/bvn-advance/:public_key')
    }
  }