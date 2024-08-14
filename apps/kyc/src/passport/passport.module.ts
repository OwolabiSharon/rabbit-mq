import { NG_KYC_Passport, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportController } from './passport.controller';
import { PassportLookupService } from './services/passport-lookup.service';

@Module({
  imports: [TypeOrmModule.forFeature([NG_KYC_Passport]), RmqModule],
  controllers: [PassportController],
  providers: [PassportLookupService],
})
export class PassportModule {}
