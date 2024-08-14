import { CustomRequest } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { LicenseLookupQueryDto } from 'apps/kyc/src/driversLicense/dto/license-lookup.dto';
import { DriversLicenseClientService } from './drivers-license.service';

@Controller('drivers-license')
export class DriverLicenseClientController {
  constructor(private readonly driversLicenseClientService: DriversLicenseClientService) {}

  @Get('lookup/:public_key')
  @HttpCode(200)
  async cacBasic(@Query() license: LicenseLookupQueryDto, @Req() request: CustomRequest) {
    const result = await this.driversLicenseClientService.licenseLookup(
      license,
      request.middlewareInfo,
    );
    return result;
  }
}
