import { KENYA_KYC_NIN, NG_KYC_NIN, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NinController } from './nin.controller';
import { KenyaNinLookupService } from './services/kenya-nin-lookup.service';
import { NinLookupService } from './services/nin-lookup.service';
import { NinSelfieService } from './services/nin-selfie.service';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_NIN, KENYA_KYC_NIN]), RmqModule],
  controllers: [NinController],
  providers: [NinLookupService, NinSelfieService, KenyaNinLookupService],
})
export class NinModule {}
