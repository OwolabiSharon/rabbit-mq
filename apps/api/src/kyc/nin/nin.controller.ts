import { CustomRequest } from '@app/common/utils/response';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { KenyaNinLookupDto } from 'apps/kyc/src/nin/dto/kenya-nin-lookup.dto';
import { NinLookupQueryDto } from 'apps/kyc/src/nin/dto/nin-lookup.dto';
import { NinSelfieQueryDto } from 'apps/kyc/src/nin/dto/nin-selfie.dto';
import { NinClientService } from './nin.service';

@Controller('nin')
export class NinClientController {
  constructor(private readonly ninClientService: NinClientService) {}

  @Get('lookup/:public_key')
  @HttpCode(200)
  async ninBasic(@Query() nin: NinLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.ninClientService.ninLookup(nin, request.middlewareInfo);
    return result;
  }

  @Post('selfie-nin/:public_key')
  @HttpCode(200)
  async selfienin(@Body() body: NinSelfieQueryDto, @Req() request: CustomRequest) {
    const result = await this.ninClientService.selfienin(body, request.middlewareInfo);
    return result;
  }

  @Post('kenya/lookup/:public_key')
  @HttpCode(200)
  async kenyaNin(@Body() body: KenyaNinLookupDto, @Req() request: CustomRequest) {
    const result = await this.ninClientService.kenyaNin(body, request.middlewareInfo);
    return result;
  }
}
