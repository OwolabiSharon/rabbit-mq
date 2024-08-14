import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { middlewareInfoType } from 'apps/kyc/types';
import { SelfieBvnQueryDto } from './dto/selfie-bvn.dto';
import { BvnLoookupAdvanceService } from './services/bvn-lookup-advance.service';
import { BvnLoookupBasicService } from './services/bvn-lookup-basic.service';
import { SelfieBvnService } from './services/selfie-bvn.service';

@Controller('bvn')
export class BvnController {
  constructor(
    private readonly bvnLoookupAdvanceService: BvnLoookupAdvanceService,
    private readonly bvnLoookupBasicService: BvnLoookupBasicService,
    private readonly selfieBvnService: SelfieBvnService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'bvn-basic-lookup' })
  async bvnLookupBasic(@Payload() data: any, @Ctx() context: RmqContext) {
    const { bvn, middlewareInfo } = data;
    const result: any = await this.bvnLoookupBasicService.execute(bvn.bvn, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'bvn-advance-lookup' })
  async bvnLookupAdvance(@Payload() data: any, @Ctx() context: RmqContext) {
    const { bvn, middlewareInfo } = data;
    const result: any = await this.bvnLoookupAdvanceService.execute(
      bvn.bvn,
      middlewareInfo,
      context,
    );
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'bvn-selfie-lookup' })
  async selfieBvn(@Payload() data: any, @Ctx() context: RmqContext) {
    const body: SelfieBvnQueryDto = data.body;
    const middlewareInfo: middlewareInfoType = data.middlewareInfo;
    const result: any = await this.selfieBvnService.execute(body, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
