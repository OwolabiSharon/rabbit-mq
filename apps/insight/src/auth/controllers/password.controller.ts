import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { ResetPasswordService } from '../services/reset-password.service';


@Controller('password')
export class Password {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService,
        private readonly resetPasswordService: ResetPasswordService,
    ) {}

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

}