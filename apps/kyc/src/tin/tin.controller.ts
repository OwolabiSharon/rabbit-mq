import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { TinLookupService } from './services/tin-lookup.service';

@Controller('tin')
export class TinController {
  constructor(private tinService: TinLookupService, private readonly rmqService: RmqService) {}

  @MessagePattern({ cmd: 'tin-lookup' })
  async bvnLookupBasic(@Payload() data: any, @Ctx() context: RmqContext) {
    const { tin, middlewareInfo } = data;
    const result: any = await this.tinService.execute(tin.tin, middlewareInfo);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
