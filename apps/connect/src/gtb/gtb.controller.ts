import { CustomerAccount, RmqService } from '@app/common';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { GtbLoginDto, GtbQueryDto } from './dto/gtb.dto';
import { GtbLoginService } from './services/gtb-login';
import { RegenerateGtbTransaction } from './services/regenerate-gtb-transaction';

@Controller('gtb')
export class GtbController {
  constructor(
    private readonly gtbLoginService: GtbLoginService,
    private readonly regenerateGtbTransaction: RegenerateGtbTransaction,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'gtb-login' })
  async gtbLogin(
    @Payload()
    {
      data,
      query,
    }: {
      data: GtbLoginDto;
      query: GtbQueryDto;
    },
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.gtbLoginService.execute(query, data, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'gtb-statement' })
  async gtbRegenerateStatement(
    @Payload() account: CustomerAccount,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.regenerateGtbTransaction.execute(account, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
