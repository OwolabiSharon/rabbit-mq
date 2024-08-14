import { User } from '@app/common';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutUser(@Res() response: Response): Promise<SuccessResponseType> {
    const result = await this.authService.logout(response);
    return successResponse({
      message: 'Login Successful',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
