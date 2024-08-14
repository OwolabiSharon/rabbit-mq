import { RmqService } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccessLoginService } from './access/services/access-login';
import { RegenerateAccessStatement } from './access/services/regenerate-access-statement';
import { ConnectService } from './connect.service';

@Controller()
export class ConnectController {
  constructor(private readonly connectService: ConnectService) {}

  @Get()
  getHello(): string {
    return this.connectService.getHello();
  }
}
