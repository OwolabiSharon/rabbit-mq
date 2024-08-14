import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { middlewareInfoType } from 'apps/kyc/types';
import { NinSelfieQueryDto } from './dto/nin-selfie.dto';
import { KenyaNinLookupService } from './services/kenya-nin-lookup.service';
import { NinLookupService } from './services/nin-lookup.service';
import { NinSelfieService } from './services/nin-selfie.service';

@Controller('nin')
export class NinController {
  constructor(
    private readonly ninLookupService: NinLookupService,
    private readonly selfieNinService: NinSelfieService,
    private readonly kenyaNinLookupService: KenyaNinLookupService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'nin-lookup' })
  async ninLookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const { nin, middlewareInfo } = data;
    const result: any = await this.ninLookupService.execute(nin.nin, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'kenya-nin-lookup' })
  async kenyaNinLookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const { body, middlewareInfo } = data;
    const result: any = await this.kenyaNinLookupService.execute(body, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'nin-selfie-lookup' })
  async selfieNin(@Payload() data: any, @Ctx() context: RmqContext) {
    const body: NinSelfieQueryDto = data.body;
    const middlewareInfo: middlewareInfoType = data.middlewareInfo;
    const result: any = await this.selfieNinService.execute(body, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
