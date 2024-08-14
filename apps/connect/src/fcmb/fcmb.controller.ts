import { CustomerAccount, RmqService } from '@app/common';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FcmbQueryDto, LoginFcmbDto } from './dto/fcmb-dto';
import { FcmbLoginService } from './services/fcmb-login';
import { RegenerateFcmbStatement } from './services/regenerate-fcmb-statement';

@Controller('fcmb')
export class FcmbController {
  constructor(
    private readonly fcmbLoginService: FcmbLoginService,
    private readonly regenerateFcmbStatement: RegenerateFcmbStatement,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'fcmb-login' })
  async fcmbLogin(
    @Payload() { data, query }: { data: LoginFcmbDto; query: FcmbQueryDto },
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.fcmbLoginService.execute(query, data, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'fcmb-statement' })
  async fcmbRegenerateStatement(
    @Payload() account: CustomerAccount,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.regenerateFcmbStatement.execute(account, context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
