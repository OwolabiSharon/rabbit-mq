import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { AdvancedPhoneLookupQueryDto } from 'apps/kyc/src/phoneNumber/dto/advanced-phone-lookup.dto';
import { BasicPhoneLookupQueryDto } from 'apps/kyc/src/phoneNumber/dto/basic-phone-lookup.dto';
import { PhoneNumberClientService } from './phone-number.service';

@Controller('phone')
export class PhoneNumberClientController {
  constructor(private readonly phoneNumberClientService: PhoneNumberClientService) {}

  @Get('phone-basic/:public_key')
  @HttpCode(200)
  async phoneBasic(@Query() query: BasicPhoneLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.phoneNumberClientService.phoneBasic(query, request.middlewareInfo);
    return result;
  }

  @Get('phone-advance/:public_key')
  @HttpCode(200)
  async phoneAdvance(@Query() query: AdvancedPhoneLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.phoneNumberClientService.phoneAdvance(query, request.middlewareInfo);
    return result;
  }
}
