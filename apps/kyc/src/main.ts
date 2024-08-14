import { NestFactory } from '@nestjs/core';
import { KycModule } from './kyc.module';
import { RmqService, GlobalExceptionFilter } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(KycModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('KYC'));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
