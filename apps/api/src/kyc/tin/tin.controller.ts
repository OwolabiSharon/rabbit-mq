import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { TinLookupQueryDto } from 'apps/kyc/src/tin/dto/tin-lookup.dto';
import { TinClientService } from './tin.service';

@Controller('tin')
export class TinClientController {
  constructor(private readonly tinClientService: TinClientService) {}

  @Get('lookup/:public_key')
  @HttpCode(200)
  async tinLookup(@Query() tin: TinLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.tinClientService.tinLookup(tin, request.middlewareInfo);
    return result;
  }
}
