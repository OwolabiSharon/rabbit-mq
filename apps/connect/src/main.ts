import { RmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { ConnectModule } from './connect.module';

async function bootstrap() {
  const app = await NestFactory.create(ConnectModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CONNECT'));
  await app.startAllMicroservices();
}
bootstrap();
