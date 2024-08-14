import { NG_KYC_BVN_ADVANCE, RmqModule } from '@app/common';
import { NG_KYC_BVN_BASIC } from '@app/common/database/models/ng_kyc_models/ng_kyc_bvn_basic';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BvnController } from './bvn.controller';
import { BvnLoookupAdvanceService } from './services/bvn-lookup-advance.service';
import { BvnLoookupBasicService } from './services/bvn-lookup-basic.service';
import { SelfieBvnService } from './services/selfie-bvn.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NG_KYC_BVN_ADVANCE, NG_KYC_BVN_BASIC]),
    RmqModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [BvnController],
  providers: [BvnLoookupAdvanceService, BvnLoookupBasicService, SelfieBvnService],
})
export class BvnModule {}
