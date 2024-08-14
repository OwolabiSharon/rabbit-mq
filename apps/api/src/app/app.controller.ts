import { JwtAuthGuard } from '@app/common';
import { CustomRequest, successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateAppDto, UpdateAppDto } from './dto';
import { CreateAppService } from './services/create-app.service';
import { EditAppService } from './services/edit-app.service';
import { GetAppByNameService } from './services/get-app-by-name.service';
import { GetAppService } from './services/get-app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly createAppService: CreateAppService,
    private readonly getAppService: GetAppService,
    private readonly getAppByNameService: GetAppByNameService,
    private readonly ediitAppService: EditAppService,
  ) {}

  @Post('new')
  @HttpCode(201)
  async createApp(
    @Headers('business_id') id: string,
    @Body() data: CreateAppDto,
  ): Promise<SuccessResponseType> {
    data.business_id = id;
    const result = await this.createAppService.createApp(data);
    return successResponse({
      message: 'App Created',
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get(':id')
  @HttpCode(200)
  async getAppDetails(
    @Headers('business_id') business_id: string,
    @Param('id') id: string,
  ): Promise<SuccessResponseType> {
    const result = await this.getAppService.execute(business_id, id);
    return successResponse({
      message: 'App fetched successfully',
      data: result,
      status: 'success',
      code: HttpStatus.OK,
    });
  }

  @Patch(':id')
  @HttpCode(200)
  async editApp(@Body() data: UpdateAppDto, @Param('id') id: string): Promise<SuccessResponseType> {
    const result = await this.ediitAppService.execute(data, id);
    return successResponse({
      message: 'App updated successfully',
      data: result,
      status: 'success',
      code: HttpStatus.OK,
    });
  }

  @Get(':app_name')
  @HttpCode(200)
  async getAppByName(@Param('app_name') app_name: string): Promise<SuccessResponseType> {
    const result = await this.getAppByNameService.execute(app_name);
    return successResponse({
      message: 'App fetched successfully',
      data: result,
      status: 'success',
      code: HttpStatus.OK,
    });
  }
}
