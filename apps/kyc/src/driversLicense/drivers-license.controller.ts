import { RmqService } from '@app/common';
import { successResponse } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { LicenseLookupService } from './services/license-lookup.service';

@Controller('drivers-license')
export class DriversLicenseController {
  constructor(
    private readonly licenseLookupService: LicenseLookupService,
    private rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 'driver-license-lookup' })
  async cacBasic(@Payload() data: any, @Ctx() context: RmqContext) {
    const { cac, middlewareInfo } = data;
    const result: any = await this.licenseLookupService.execute(cac, middlewareInfo, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
