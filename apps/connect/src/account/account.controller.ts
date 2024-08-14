import { RmqService } from '@app/common';
import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiSyncService } from './services/api/api-sync';
import { ApiGetAccountService } from './services/api/get-account';
import { ApiGetAccountsService } from './services/api/get-accounts';
import { ApiGetIdentityService } from './services/api/get-identity';
import { ReAuthorizeAccountService } from './services/api/re-authorize-account';
import { DashboardGetAccountService } from './services/dashboard/get-account';
import { DashboardGetAccountsService } from './services/dashboard/get-accounts';
import { DashboardGetAccountBankService } from './services/dashboard/get-bank-account';
import { DashboardGetAccountsBankService } from './services/dashboard/get-bank-accounts';
import { DashboardGetIdentityService } from './services/dashboard/get-identity';

@Controller('account')
export class AccountController {
  constructor(
    private readonly apiGetAccountService: ApiGetAccountService,
    private readonly apiGetAccountsService: ApiGetAccountsService,
    private readonly apiGetIdentityService: ApiGetIdentityService,
    private readonly dashboardGetAccountService: DashboardGetAccountService,
    private readonly dashboardGetAccountsService: DashboardGetAccountsService,
    private readonly dashboardGetAccountBankService: DashboardGetAccountBankService,
    private readonly dashboardGetAccountsBankService: DashboardGetAccountsBankService,
    private readonly dashboardGetIdentityService: DashboardGetIdentityService,
    private readonly reAuthorizeAccountService: ReAuthorizeAccountService,
    private readonly apiSyncService: ApiSyncService,
    private readonly rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 're-authorize-account' })
  async reAuthorizeAccout(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const { req, res } = data;
    const result = await this.reAuthorizeAccountService.execute(req, res);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'api-sync' })
  async apiSync(@Payload() data: any, @Ctx() context: RmqContext): Promise<SuccessResponseType> {
    const { req, res } = data;
    const result = await this.apiSyncService.execute(req.middlewareInfo, res, context);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'api-get-accounts' })
  async apiGetAccounts(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetAccountsService.execute(data);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'api-get-account' })
  async apiGetAccount(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetAccountService.execute(data);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'api-get-identity' })
  async apiGetIdentity(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.apiGetIdentityService.execute(data);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'dash-get-bank-account' })
  async dashGetBankAccount(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.dashboardGetAccountBankService.execute(data);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'dash-get-bank-accounts' })
  async dashGetBankAccounts(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const { public_key, business_id } = data;
    const result = await this.dashboardGetAccountsBankService.execute(public_key, business_id);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'dash-get-account' })
  async dashGetAccount(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const { bvn, business_id, public_key } = data;
    const result = await this.dashboardGetAccountService.execute(bvn, business_id, public_key);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'dash-get-accounts' })
  async dashGetAccounts(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const { business_id, public_key } = data;
    const result = await this.dashboardGetAccountsService.execute(business_id, public_key);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }

  @MessagePattern({ cmd: 'dash-get-identity' })
  async dashGetIdentity(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ): Promise<SuccessResponseType> {
    const result = await this.dashboardGetIdentityService.execute(data);
    this.rmqService.ack(context);
    return successResponse({
      message: 'ok',
      code: 200,
      data: result,
    });
  }
}
