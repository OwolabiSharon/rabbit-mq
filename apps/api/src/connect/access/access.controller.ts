import { CustomerAccount } from '@app/common';
import { Body, Controller, Headers, HttpCode, Post, Query, Req } from '@nestjs/common';
import { AccessLoginDto, AccessQueryDto } from 'apps/connect/src/access/dto/access.dto';
import { AccessClientService } from './access.service';

interface CustomRequest extends Request {
  account?: CustomerAccount;
}

@Controller('access')
export class AccessClientController {
  constructor(private readonly accessClientService: AccessClientService) {}

  @Post('login')
  @HttpCode(200)
  async accessLogin(
    @Body() data: AccessLoginDto,
    @Query() query: AccessQueryDto,
  ) {
    const result = await this.accessClientService.accessLogin(data, query);
    return result;
  }

  @Post('regenerate/:account_id')
  @HttpCode(200)
  async accessRegenerateStatement(@Req() req: CustomRequest) {
    const account = req.account;
    const result = await this.accessClientService.generateStatement(account);
    return result;
  }
}
