import { CustomRequest } from '@app/common/utils/response';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { VinLookupDto } from 'apps/kyc/src/vin/dto/vin-lookup.dto';
import { VinClientService } from './vin.service';

@Controller('vin')
export class VinClientController {
  constructor(private readonly vinClient: VinClientService) {}

  @Post('lookup/:public_key')
  @HttpCode(200)
  async vinBasic(@Body() body: VinLookupDto, @Req() request: CustomRequest) {
    const result = await this.vinClient.vinLookup(body, request.middlewareInfo);
    return result;
  }
}
