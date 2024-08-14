import { JwtAuthGuard } from '@app/common';
import { CustomRequest, successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RejectBusinessDto } from './dto/reject-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { GetBusinessService } from './services/get-business.service';
import { getProfilePercentService } from './services/get-profile-percent';
import { GetRejectedBusinessService } from './services/get-rejected-business';
import { GetUnverifiedBusinessService } from './services/get-unverified-business';
import { GetUserBusinessService } from './services/get-user-business';
import { RejectBusinessService } from './services/reject-business';
import { UpdateBusinessService } from './services/update-business';
import { VerifyBusinessService } from './services/verifiy-business';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly updateBusinessService: UpdateBusinessService,
    private readonly getProfilePercentService: getProfilePercentService,
    private readonly getBusinessService: GetBusinessService,
    private readonly getUserBusinessService: GetUserBusinessService,
    private readonly getUnverifiedBusinessService: GetUnverifiedBusinessService,
    private readonly getRejectedBusinessService: GetRejectedBusinessService,
    private readonly rejectBusinessService: RejectBusinessService,
    private readonly verifyBusinessService: VerifyBusinessService,
  ) {}

  @Patch('update-business-info')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async updateBusiness(
    @Headers('business_id') id: string,
    @Body() data: UpdateBusinessDto,
    @Req() req: CustomRequest,
  ): Promise<SuccessResponseType> {
    const result = await this.updateBusinessService.execute(data, id, req.user.id);
    return successResponse({
      message: result.msg ? result.msg : 'Business Updated and Verified',
      code: HttpStatus.OK,
      status: 'success',
      data: result.business ? result.business : null,
    });
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAllApps(@Req() req: CustomRequest): Promise<SuccessResponseType> {
    const result = await this.getBusinessService.execute(req.user.id);
    return successResponse({
      message: 'Business Fetched',
      data: result,
      status: 'success',
      code: HttpStatus.OK,
    });
  }

  @Get('user-business')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getUserBusiness(@Req() req: CustomRequest): Promise<SuccessResponseType> {
    const result = await this.getUserBusinessService.execute(req.user.id);
    return successResponse({
      message: 'User Business Fetched',
      data: result,
      status: 'success',
      code: HttpStatus.OK,
    });
  }

  @Get('profile-percent')
  @HttpCode(200)
  async getProfilePercent(@Headers('business_id') business_id: string) {
    console.log(business_id);
    const result = await this.getProfilePercentService.execute(business_id);
    return successResponse({
      message: 'profile percentage',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('unverified-business')
  @HttpCode(200)
  async getUnverifiedBusiness(@Headers('business_id') business_id: string) {
    const result = await this.getUnverifiedBusinessService.execute(business_id);
    return successResponse({
      message: 'Unverified business fetched',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('rejected-business')
  @HttpCode(200)
  async getRejectedBusiness(@Headers('business_id') business_id: string) {
    const result = await this.getRejectedBusinessService.execute(business_id);
    return successResponse({
      message: 'Rejected business fetched',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Patch('reject-business')
  @HttpCode(200)
  async rejectBusiness(
    @Headers('business_id') business_id: string,
    @Body() data: RejectBusinessDto,
  ) {
    const result = await this.rejectBusinessService.execute(business_id, data);
    return successResponse({
      message: 'Business rejected',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Patch('verify-business')
  @HttpCode(200)
  async verifyBusiness(@Headers('business_id') business_id: string) {
    const result = await this.verifyBusinessService.execute(business_id);
    return successResponse({
      message: 'Business verified',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }
}
