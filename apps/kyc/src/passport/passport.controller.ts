import { Controller } from '@nestjs/common';
import { successResponse } from '@app/common/utils/response';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PassportLookupService } from './services/passport-lookup.service';
import { RmqService } from '@app/common';

@Controller('passport')
export class PassportController {
  constructor(
    private readonly passportLookupService: PassportLookupService,
    private rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 'passport-lookup' })
  async passportLookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const { body, middlewareInfo } = data;

    const result: any = await this.passportLookupService.execute(body, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
