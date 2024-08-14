import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NubanLookupService } from './services/nuban-lookup.service';

@Controller('nuban')
export class NubanController {
  constructor(
    private readonly nubanLookupService: NubanLookupService,
    private rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 'nuban-lookup' })
  async nubanLookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const { query, middlewareInfo } = data;
    const result: any = await this.nubanLookupService.execute(query, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
