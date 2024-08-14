import { CustomRequest } from '@app/common/utils/response';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { BvnLookupQueryDto } from 'apps/kyc/src/bvn/dto/bvn-lookup.dto';
import { SelfieBvnQueryDto } from 'apps/kyc/src/bvn/dto/selfie-bvn.dto';
import { BvnClientService } from './bvn.service';

@Controller('bvn')
export class BvnClientController {
  constructor(private readonly bvnClientService: BvnClientService) {}

  @Get('bvn-basic/:public_key')
  @HttpCode(200)
  async bvnBasic(@Query() bvn: BvnLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.bvnClientService.bvnBasic(bvn, request.middlewareInfo);
    return result;
  }

  @Get('bvn-advance/:public_key')
  @HttpCode(200)
  async bvnAdvance(@Query() bvn: BvnLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.bvnClientService.bvnAdvance(bvn, request.middlewareInfo);
    return result;
  }

  @Post('selfie-bvn/:public_key')
  @HttpCode(200)
  async selfieBvn(@Body() body: SelfieBvnQueryDto, @Req() request: CustomRequest) {
    const result = await this.bvnClientService.selfieBvn(body, request.middlewareInfo);
    return result;
  }
}
