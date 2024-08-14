import { JwtAuthGuard } from '@app/common';
import { CustomRequest, successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordService } from './services/change-password';
import { CreateUserService } from './services/create-user';
import { ForgotPasswordService } from './services/forgot-password';
import { GetUserService } from './services/get-user';
import { LoginUserService } from './services/login-user';
import { ResendVerificationService } from './services/resend-verification';
import { ResetPasswordService } from './services/reset-password';
import { UpdateProfileService } from './services/update-profile';
import { VerifyEmailService } from './services/verify-email';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly loginUserService: LoginUserService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendVerificationService: ResendVerificationService,
    private readonly updateProfileService: UpdateProfileService,
    private readonly getUserService: GetUserService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async createUser(
    @Body() request: CreateUserDto,
    @Res() response: Response,
  ): Promise<SuccessResponseType> {
    const result = await this.createUserService.execute(request, response);
    return successResponse({
      message: 'Please check your email to verify your account. spam inclusive',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getUser(@Req() request: CustomRequest): Promise<SuccessResponseType> {
    const result = await this.getUserService.execute(request.user.id);
    return successResponse({
      message: 'User profile fetched successfully',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Post('login')
  async loginUser(
    @Body() data: LoginUserDto,
    @Res() response: Response,
  ): Promise<SuccessResponseType> {
    const result = await this.loginUserService.execute(data, response);
    return successResponse({
      message: 'Login Successful',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto): Promise<SuccessResponseType> {
    await this.forgotPasswordService.execute(data);
    return successResponse({
      message: 'Please check your email, link valid for 5min',
      code: HttpStatus.OK,
      data: null,
    });
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto): Promise<SuccessResponseType> {
    await this.resetPasswordService.execute(data);
    return successResponse({
      message: 'Password reset successfully',
      code: HttpStatus.OK,
      data: null,
    });
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDto,
    @Req() request: CustomRequest,
  ): Promise<SuccessResponseType> {
    await this.changePasswordService.execute(data, request.user.id);
    return successResponse({
      message: 'Password changed successfully',
      code: HttpStatus.OK,
      data: null,
    });
  }

  @Patch('update-user-profile')
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Body() data: UpdateUserProfileDto,
    @Req() request: CustomRequest,
  ): Promise<SuccessResponseType> {
    const result = await this.updateProfileService.execute(data, request.user.id);
    return successResponse({
      message: 'Profile Updated',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Post('verify-email')
  async verifyEmail(@Body() data: VerifyEmailDto): Promise<SuccessResponseType> {
    await this.verifyEmailService.execute(data);
    return successResponse({
      message: 'Email verified',
      code: HttpStatus.OK,
      data: null,
    });
  }

  @Post('resend-email-verification')
  async resendVerification(@Body() data: ResendVerificationDto): Promise<SuccessResponseType> {
    await this.resendVerificationService.execute(data);
    return successResponse({
      message: 'Please check your email to verify your account',
      code: HttpStatus.OK,
      data: null,
    });
  }
}
