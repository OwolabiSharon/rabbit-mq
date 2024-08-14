import { App, AuthModule, Business, MAIL_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import {
  CreateAppService,
  EditAppService,
  GetAppByNameService,
  GetAppService,
  GetBusinessService,
} from './services';

@Module({
  imports: [
    RmqModule.register({ name: MAIL_SERVICE }),
    TypeOrmModule.forFeature([App, Business]),
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [CreateAppService, EditAppService, GetAppByNameService, GetAppService],
  exports: [],
})
export class AppModule {}
