import { NestFactory } from '@nestjs/core';
import { RmqService, GlobalExceptionFilter } from '@app/common';
import { InsightModule } from './insight.module';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from "cookie-parser";
//import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InsightModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('INSIGHTS', true));
  //app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
 
  // const document = SwaggerModule.createDocument(
  //   app,
  //   new DocumentBuilder()
  //     .setTitle('Zeeh Auth Service')
  //     .setDescription('Auth Service root which extends to all services')
  //     .setVersion('1.0')
  //     .addBasicAuth()
  //     .build(),
  // );
  // SwaggerModule.setup('docs', app, document, { swaggerUrl: '/api-docs' });

  await app.startAllMicroservices();
  console.log(configService.get('PORT'));
  await app.listen(configService.get('PORT'));
}
bootstrap();