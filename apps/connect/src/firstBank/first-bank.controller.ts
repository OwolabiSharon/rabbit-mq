import { CustomerAccount, RmqService } from '@app/common';
import { ExceptionFilter } from '@app/common/filters/rpc-exception-filter';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FirstBankLoginDto, FirstBankQueryDto } from './dto/firstbank.dto';
import { FirstBankLoginService } from './services/firstbank-login';
import { RegenerateFirstBankStatement } from './services/regenerate-firstbank-statement';

@Controller('first-bank')
export class FirstBankController {
  constructor(
    private readonly firstBankLoginService: FirstBankLoginService,
    private readonly regenerateFirstBankStatement: RegenerateFirstBankStatement,
    private readonly rmqService: RmqService,
  ) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'firstbank-login' })
  async firstbankLogin(
    @Payload()
    { data, query }: { data: FirstBankLoginDto; query: FirstBankQueryDto },
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.firstBankLoginService.execute(query, data, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'firstbank-statement' })
  async firstbankRegenerateStatement(
    @Payload() account: CustomerAccount,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.regenerateFirstBankStatement.execute(account, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
