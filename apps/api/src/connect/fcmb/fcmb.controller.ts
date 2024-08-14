import { CustomerAccount } from '@app/common';
import { Body, Controller, HttpCode, Post, Query, Req } from '@nestjs/common';
import { FcmbQueryDto, LoginFcmbDto } from 'apps/connect/src/fcmb/dto/fcmb-dto';
import { FcmbClientService } from './fcmb.service';

interface CustomRequest extends Request {
  account?: CustomerAccount;
}

@Controller('fcmb')
export class FcmbClientController {
  constructor(private readonly fcmbClientService: FcmbClientService) {}

  @Post('login')
  @HttpCode(200)
  async fcmbLogin(@Body() data: LoginFcmbDto, @Query() query: FcmbQueryDto) {
    const result = await this.fcmbClientService.fcmbLogin(data, query);
    return result;
  }

  @Post('regenerate/:account_id')
  @HttpCode(200)
  async fcmbRegenerateStatement(@Req() req: CustomRequest) {
    const account = req.account;
    const result = await this.fcmbClientService.generateStatement(account);
    return result;
  }
}
