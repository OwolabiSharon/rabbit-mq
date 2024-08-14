import { CustomerAccount } from '@app/common';
import { Body, Controller, HttpCode, Post, Query, Req } from '@nestjs/common';
import { GtbLoginDto, GtbQueryDto } from 'apps/connect/src/gtb/dto/gtb.dto';
import { GtbClientService } from './gtb.service';

interface CustomRequest extends Request {
  account?: CustomerAccount;
}

@Controller('gtb')
export class GtbClientController {
  constructor(private readonly gtbClientService: GtbClientService) {}

  @Post('login')
  @HttpCode(200)
  async gtbLogin(@Body() data: GtbLoginDto, @Query() query: GtbQueryDto) {
    const result = await this.gtbClientService.GtbLogin(data, query);
    return result;
  }

  @Post('regenerate/:account_id')
  @HttpCode(200)
  async gtbRegenerateStatement(@Req() req: CustomRequest) {
    const account = req.account;
    const result = await this.gtbClientService.generateStatement(account);
    return result;
  }
}
