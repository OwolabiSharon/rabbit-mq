import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AdvancedPhoneLookupService } from './services/advanced-phone-lookup.service';
import { BasicPhoneLookupService } from './services/basic-phone-lookup.service';

@Controller('phone-number')
export class PhoneNumberController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly basicPhoneLookupService: BasicPhoneLookupService,
    private readonly advancedPhoneLookupService: AdvancedPhoneLookupService,
  ) {}
  @MessagePattern({ cmd: 'phone-basic-lookup' })
  async phoneLookupBasic(@Payload() data: any, @Ctx() context: RmqContext) {
    const { query, middlewareInfo } = data;
    const result: any = await this.basicPhoneLookupService.execute(query, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'phone-advance-lookup' })
  async phoneLookupAdvance(@Payload() data: any, @Ctx() context: RmqContext) {
    const { query, middlewareInfo } = data;
    const result: any = await this.advancedPhoneLookupService.execute(
      query,
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
}
