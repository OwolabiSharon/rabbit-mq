import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { middlewareInfoType } from 'apps/kyc/types';
import { VinLookupDto } from './dto/vin-lookup.dto';
import { VinLookupService } from './services/vin-lookup.service';

@Controller('vin')
export class VinController {
  constructor(private readonly vinService: VinLookupService, private rmqService: RmqService) {}

  @MessagePattern({ cmd: 'vin-lookup' })
  async vinlookup(@Payload() data: any, @Ctx() context: RmqContext) {
    const body: VinLookupDto = data.body;
    const middlewareInfo: middlewareInfoType = data.middlewareInfo;
    const result: any = await this.vinService.execute(body, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
