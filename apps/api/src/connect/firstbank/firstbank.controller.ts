import { CustomerAccount } from '@app/common';
import { Body, Controller, HttpCode, Post, Query, Req } from '@nestjs/common';
import { FirstBankLoginDto, FirstBankQueryDto } from 'apps/connect/src/firstBank/dto/firstbank.dto';
import { FirstBankClientService } from './firstbank.service';

interface CustomRequest extends Request {
  account?: CustomerAccount;
}

@Controller('firstbank')
export class FirstBankClientController {
  constructor(private readonly firstbankClientService: FirstBankClientService) {}

  @Post('login')
  @HttpCode(200)
  async firstBankLogin(@Body() data: FirstBankLoginDto, @Query() query: FirstBankQueryDto) {
    const result = await this.firstbankClientService.firstBankLogin(data, query);
    return result;
  }

  @Post('regenerate/:account_id')
  @HttpCode(200)
  async firstBankRegenerateStatement(@Req() req: CustomRequest) {
    const account = req.account;
    const result = await this.firstbankClientService.generateStatement(account);
    return result;
  }
}
