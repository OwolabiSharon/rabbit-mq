import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { CacCorporateQueryDto, CacLookupQueryDto } from 'apps/kyc/src/cac/dto';
import { CacClientService } from './cac.service';

@Controller('cac')
export class CacClientController {
  constructor(private readonly cacClient: CacClientService) {}

  @Get('cac-basic/:public_key')
  @HttpCode(200)
  async cacBasic(@Query() cac: CacLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.cacClient.cacBasic(cac, request.middlewareInfo);
    return result;
  }

  @Get('cac-advance/:public_key')
  @HttpCode(200)
  async cacAdvance(@Query() cac: CacCorporateQueryDto, @Req() request: CustomRequest) {
    const result = await this.cacClient.cacAdvance(cac, request.middlewareInfo);
    return result;
  }
}
