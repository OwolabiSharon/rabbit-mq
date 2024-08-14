import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { NubanLookupDto } from 'apps/kyc/src/nuban/dto/nuban-lookup.dto';
import { NubanClientService } from './nuban.service';

@Controller('nuban')
export class NubanClientController {
  constructor(private readonly nubanClientService: NubanClientService) {}

  @Get('lookup/:public_key')
  @HttpCode(200)
  async nubanLookup(@Query() query: NubanLookupDto, @Req() request: CustomRequest) {
    const result = await this.nubanClientService.nubanLookup(query, request.middlewareInfo);
    return result;
  }
}
