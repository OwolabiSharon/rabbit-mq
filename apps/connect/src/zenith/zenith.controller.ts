import { CustomerAccount } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ZenithLoginDto, ZenithQueryDto } from './dto/zenith.dto';
import { RegenerateZenithStatement } from './services/regenerate-zenith-statement';
import { ZenithLoginService } from './services/zenith-login';

@Controller('zenith')
export class ZenithController {
  constructor(
    private readonly zenithLoginService: ZenithLoginService,
    private readonly regenerateZenithStatement: RegenerateZenithStatement,
  ) {}

  @MessagePattern({ cmd: 'zenith-login' })
  async zenithLogin(data: ZenithLoginDto, query: ZenithQueryDto) {
    const result = await this.zenithLoginService.execute(query, data);
    return result;
  }

  @MessagePattern({ cmd: 'zenith-statement' })
  async zenithRegenerateStatement(account: CustomerAccount) {
    const result = await this.regenerateZenithStatement.execute(account);
    return result;
  }
}
