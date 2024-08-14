import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { PassportLookupDto } from 'apps/kyc/src/passport/dto/passport-lookup.dto';
import { SelfieLookupDto } from 'apps/kyc/src/selfie/dto/selfie-lookup.dto';
import { SelfieClientService } from './selfie.service';

@Controller('selfie')
export class SelfieClientController {
  constructor(private readonly selfieClientService: SelfieClientService) {}

  @Get('lookup/:public_key')
  @HttpCode(200)
  async selfieLookup(@Query() query: SelfieLookupDto, @Req() request: CustomRequest) {
    const result = await this.selfieClientService.selfieLookup(query, request.middlewareInfo);
    return result;
  }
}
