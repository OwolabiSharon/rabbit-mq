import { CustomRequest } from '@app/common/utils/response';
import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { PassportLookupDto } from 'apps/kyc/src/passport/dto/passport-lookup.dto';
import { PassportClientService } from './passport.service';

@Controller('passport')
export class PassportClientController {
  constructor(private readonly passportClientService: PassportClientService) {}

  @Post('lookup/:public_key')
  @HttpCode(200)
  async passportLookup(@Body() body: PassportLookupDto, @Req() request: CustomRequest) {
    const result = await this.passportClientService.passportLookup(body, request.middlewareInfo);
    return result;
  }
}
