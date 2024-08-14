import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SelfieController } from './selfie.controller';
import { SelfieLookupService } from './services/selfie-lookup.service';

@Module({
  imports: [RmqModule],
  controllers: [SelfieController],
  providers: [SelfieLookupService],
})
export class SelfieModule {}
