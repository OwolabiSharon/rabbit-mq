import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AUTH_SERVICE } from '../constants';
import { RmqModule } from '../rmq';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    _consumer.apply(cookieParser()).forRoutes('*');
  }
}
