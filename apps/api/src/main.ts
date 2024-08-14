import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { ApiModule } from './api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountClientModule } from './account/account.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  // const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Zeeh API')
      .setDescription('API gateway for all Zeeh Endpoints')
      .setVersion('1.0')
      .addBasicAuth()
      .build(),
  );

  SwaggerModule.setup('docs', app, document, { swaggerUrl: '/api-docs' });
  const accountDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Zeeh API')
      .setDescription('API gateway for all Zeeh Endpoints')
      .setVersion('1.0')
      .addBasicAuth()
      .addTag('account')
      .build(),
  );

  const accountDocument = SwaggerModule.createDocument(app, accountDoc, {
    include: [AccountClientModule],
  });
  SwaggerModule.setup('docs/account', app, accountDocument);
  await app.startAllMicroservices();
  console.log(configService.get('PORT'));
  
  await app.listen(configService.get('PORT'));
}
bootstrap();
