import { RmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();
}
bootstrap();
