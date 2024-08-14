import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller, Get, Headers, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiGetBalanceService } from './services/api-get-balance';
import { DashboardGetBalanceService } from './services/dashboard-get-balance';

@Controller('balance')
export class BalanceController {
  constructor(
    private readonly apiGetBalanceService: ApiGetBalanceService,
    private readonly dashboardGetBalanceService: DashboardGetBalanceService,
  ) {}

  @Get('live/:public_key')
  @HttpCode(200)
  async apiGetBalance(
    @Headers('zeeh-private-key') private_key: string,
    @Param('public_key') public_key: string,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetBalanceService.execute(private_key, public_key);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('dashboard/:business_id')
  @HttpCode(200)
  async dashboardGetBalance(
    @Param('business_id') business_id: string,
  ): Promise<SuccessResponseType> {
    const result = await this.dashboardGetBalanceService.execute(business_id);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }
}
