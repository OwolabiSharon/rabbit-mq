import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule, Business, MAIL_SERVICE, RmqModule, User } from '@app/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CreateUserService } from './services/create-user';
import { LoginUserService } from './services/login-user';
import { ForgotPasswordService } from './services/forgot-password';
import { ResetPasswordService } from './services/reset-password';
import { UserVerificationMail } from '../helpers/mails/user-verification.mail';
import { VerifyEmailService } from './services/verify-email';
import { ResendVerificationService } from './services/resend-verification';
import { AuthService } from '../auth.service';
import { GetUserService } from './services/get-user';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UpdateProfileService } from './services/update-profile';
import { ForgotPasswordMail } from '../helpers/mails/forgot-password';
import { ChangePasswordService } from './services/change-password';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Business]),
    EventEmitterModule.forRoot(),
    RmqModule.register({ name: MAIL_SERVICE }),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    LoginUserService,
    ForgotPasswordService,
    ResetPasswordService,
    UserVerificationMail,
    VerifyEmailService,
    ResendVerificationService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GetUserService,
    UpdateProfileService,
    ForgotPasswordMail,
    ChangePasswordService,
  ],
  exports: [GetUserService],
})
export class UsersModule {}
