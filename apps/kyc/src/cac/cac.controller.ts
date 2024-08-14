import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CacCorporateService } from './services/cac-corporate.service';
import { CacLookupService } from './services/cac-lookup.service';

@Controller('cac')
export class CacController {
  constructor(
    private readonly cacbasicservice: CacLookupService,
    private readonly cacadvanceservice: CacCorporateService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'cac-basic-lookup' })
  async cacBasic(@Payload() data: any, @Ctx() context: RmqContext) {
    const { cac, middlewareInfo } = data;
    const result: any = await this.cacbasicservice.execute(cac, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'cac-advance-lookup' })
  async cacAdvance(@Payload() data: any, @Ctx() context: RmqContext) {
    const { cac, middlewareInfo } = data;
    const result: any = await this.cacadvanceservice.execute(cac, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
