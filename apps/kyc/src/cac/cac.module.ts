import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { CacController } from './cac.controller';
import { CacCorporateService } from './services/cac-corporate.service';
import { CacLookupService } from './services/cac-lookup.service';

@Module({
  imports: [RmqModule],
  controllers: [CacController],
  providers: [CacCorporateService, CacLookupService],
})
export class CacModule {}
