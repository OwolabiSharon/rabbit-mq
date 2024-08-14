import { RmqModule } from '@app/common';
import { NG_KYC_NUBAN } from '@app/common/database/models/ng_kyc_models/ng_kyc_nuban';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NubanController } from './nuban.controller';
import { NubanLookupService } from './services/nuban-lookup.service';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_NUBAN]), RmqModule],
  controllers: [NubanController],
  providers: [NubanLookupService],
})
export class NubanModule {}
