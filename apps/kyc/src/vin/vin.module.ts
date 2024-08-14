import { NG_KYC_VIN, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinLookupService } from './services/vin-lookup.service';
import { VinController } from './vin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_VIN]), RmqModule],
  controllers: [VinController],
  providers: [VinLookupService],
})
export class VinModule {}
