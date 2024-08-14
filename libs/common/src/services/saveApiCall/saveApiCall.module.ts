import { ApiCall, App, Business } from '@app/common';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveApiCallService } from './saveApiCall.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ApiCall, App, Business])],
  providers: [SaveApiCallService],
  exports: [SaveApiCallService],
})
export class SaveApiCallModule {}
