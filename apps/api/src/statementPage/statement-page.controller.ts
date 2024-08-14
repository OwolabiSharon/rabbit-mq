import { CustomRequest, successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiGetStatement } from './api/api-get-statement';
import { ApiGetTransactionService } from './api/api-get-transaction';
import { CreateStatmentPageService } from './dashboard/create-statement-page';
import { GetStatmentsPageItemsService } from './dashboard/get-statement-page-items';
import { GetStatmentsPageService } from './dashboard/get-statement-pages';
import { GetStatmentsPageItemsWithPeriodService } from './dashboard/get-statemet-page-items-with-period';
import { GetTransactionsPageService } from './dashboard/get-transaction';
import { GetTransactionsDetailsService } from './dashboard/get-transaction-details';
import { StatementPageDto } from './dto/statementPage.dto';

@Controller('statementPage')
export class StatementPageController {
  constructor(
    private readonly createStatmentPageService: CreateStatmentPageService,
    private readonly getStatmentsPageService: GetStatmentsPageService,
    private readonly getTransactionsPageService: GetTransactionsPageService,
    private readonly apiGetStatementService: ApiGetStatement,
    private readonly apiGetTransactionService: ApiGetTransactionService,
    private readonly getStatmentsPageItemsService: GetStatmentsPageItemsService,
    private readonly getStatmentsPageItemsWithPeriodService: GetStatmentsPageItemsWithPeriodService,
    private readonly getTransactionsDetailsService: GetTransactionsDetailsService,
  ) {}

  @Get('/live/statement/:account_id')
  @HttpCode(200)
  async apiGetStatement(
    @Req() req: CustomRequest,
    @Query() query: any,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetStatementService.execute(req.middlewareInfo, query.period);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('/live/:account_id')
  @HttpCode(200)
  async apiGetTrasaction(
    @Req() req: CustomRequest,
    @Query() query: any,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetTransactionService.execute(req.middlewareInfo, query);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Post('dashboard/create/:business_id')
  @HttpCode(201)
  async createStatementPage(
    @Param('business_id') business_id: string,
    @Body() data: StatementPageDto,
  ): Promise<SuccessResponseType> {
    const result = await this.createStatmentPageService.execute(business_id, data);
    return successResponse({
      message: 'success',
      code: HttpStatus.CREATED,
      data: result,
    });
  }

  @Get('dashboard/:business_id/:app_id')
  @HttpCode(200)
  async getStatementsPage(
    @Param('business_id') business_id: string,
    @Param('app_id') app_id: string,
  ): Promise<SuccessResponseType> {
    const result = await this.getStatmentsPageService.execute(business_id, app_id);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('dashboard/page/:business_id/:page_id')
  @HttpCode(200)
  async getStatementsPageItems(
    @Param('business_id') business_id: string,
    @Param('page_id') page_id: string,
  ): Promise<SuccessResponseType> {
    const result = await this.getStatmentsPageItemsService.execute(business_id, page_id);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('dashboard/pagequery/:business_id/:page_id')
  @HttpCode(200)
  async getStatementsPageItemsWithPeriod(
    @Param('business_id') business_id: string,
    @Param('page_id') page_id: string,
    @Query() query: any,
  ): Promise<SuccessResponseType> {
    const result = await this.getStatmentsPageItemsWithPeriodService.execute(
      business_id,
      page_id,
      query.period,
    );
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('transaction/dashboard/:business_id/:public_key')
  @HttpCode(200)
  async getTransactions(
    @Param('business_id') business_id: string,
    @Param('public_key') public_key: string,
  ): Promise<SuccessResponseType> {
    const result = await this.getTransactionsPageService.execute(business_id, public_key);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }

  @Get('transaction/dashboard/details/:account_id')
  @HttpCode(200)
  async getTransactionDetails(
    @Param('account_id') account_id: string,
    @Query() query: any,
  ): Promise<SuccessResponseType> {
    const result = await this.getTransactionsDetailsService.execute(account_id, query.period);
    return successResponse({
      message: 'success',
      code: HttpStatus.OK,
      data: result,
    });
  }
}
