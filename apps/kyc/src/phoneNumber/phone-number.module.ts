import { NG_KYC_BVN_BASIC, NG_KYC_Phone_Advance, NG_KYC_Phone_Basic, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumberController } from './phone-number.controller';
import { AdvancedPhoneLookupService } from './services/advanced-phone-lookup.service';
import { BasicPhoneLookupService } from './services/basic-phone-lookup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NG_KYC_Phone_Advance, NG_KYC_BVN_BASIC, NG_KYC_Phone_Basic]),
    RmqModule,
  ],
  controllers: [PhoneNumberController],
  providers: [BasicPhoneLookupService, AdvancedPhoneLookupService],
})
export class PhoneNumberModule {}
