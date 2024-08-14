import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PassportLookupService } from '../passport/services/passport-lookup.service';
import { SelfieLookupService } from './services/selfie-lookup.service';

@Controller('selfie')
export class SelfieController {
  constructor(
    private readonly selfieLookupService: SelfieLookupService,
    private rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 'selfie-lookup' })
  async selfieLookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const { query, middlewareInfo } = data;
    const result: any = await this.selfieLookupService.execute(query, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
