import { CustomerAccount, RmqService } from '@app/common';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccessLoginDto, AccessQueryDto } from './dto/access.dto';
import { AccessLoginService } from './services/access-login';
import { RegenerateAccessStatement } from './services/regenerate-access-statement';

@Controller('access')
export class AccessController {
  constructor(
    private readonly accessLoginService: AccessLoginService,
    private readonly regenerateAccessStatement: RegenerateAccessStatement,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'access-login' })
  async accessLogin(
    @Payload()
    { data, query }: { data: AccessLoginDto; query: AccessQueryDto; },
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.accessLoginService.execute(query, data, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'access-statement' })
  async accessRegenerateStatement(
    @Payload() account: CustomerAccount,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.regenerateAccessStatement.execute(account, context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
