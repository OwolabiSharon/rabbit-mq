import { NG_KYC_TIN, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TinLookupService } from './services/tin-lookup.service';
import { TinController } from './tin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_TIN]), RmqModule],
  controllers: [TinController],
  providers: [TinLookupService],
})
export class TinModule {}
