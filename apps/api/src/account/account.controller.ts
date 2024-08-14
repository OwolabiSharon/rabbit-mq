import { CustomRequest, CustomRequestTwo } from '@app/common/utils/response';
import { Controller, Get, HttpCode, Param, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AccountClientService } from './account.service';

@Controller('account')
export class AccountClientController {
  constructor(private readonly accountClientService: AccountClientService) {}

  @Get('/live/authorize-account/:account_id')
  @HttpCode(200)
  async reAuthorizeAccount(@Req() req: CustomRequestTwo, @Res() res: Response) {
    const result = await this.accountClientService.reAuthorizeAccount(req, res);
    return result;
  }

  @Get('/live/sync/:account_id')
  @HttpCode(200)
  async apiSync(@Req() req: CustomRequestTwo, @Res() res: Response) {
    const result = await this.accountClientService.apiSync(req, res);
    return result;
  }

  @Get('/live/bank-details/accounts/:public_key')
  @HttpCode(200)
  async apiGetAccounts(@Req() req: CustomRequest) {
    const result = await this.accountClientService.apiGetAccounts(req.middlewareInfo);
    return result;
  }

  @Get('/live/bank-details/account/:account_id')
  @HttpCode(200)
  async apiGetAccount(@Req() req: CustomRequest) {
    const result = await this.accountClientService.apiGetAccount(req.middlewareInfo);
    return result;
  }

  @Get('/live/identity/:account_id')
  @HttpCode(200)
  async apiGetIdentity(@Req() req: CustomRequest) {
    const result = await this.accountClientService.apiGetIdentity(req.middlewareInfo);
    return result;
  }

  @Get('/dash/accounts/bank-details/:public_key/:business_id')
  @HttpCode(200)
  async dashGetBankAccounts(
    @Param('public_key') public_key: string,
    @Param('business_id') business_id: string,
  ) {
    const result = await this.accountClientService.dashGetBankAccounts(public_key, business_id);
    return result;
  }

  @Get('/dash/account/:bvn/:business_id')
  @HttpCode(200)
  async dashGetAccount(
    @Param('public_key') bvn: string,
    @Param('business_id') business_id: string,
    @Query() query: any,
  ) {
    const result = await this.accountClientService.dashGetAccount(
      bvn,
      business_id,
      query.public_key,
    );
    return result;
  }

  @Get('/dash/accounts/:public_key/:business_id')
  @HttpCode(200)
  async dashGetAccounts(
    @Param('public_key') public_key: string,
    @Param('business_id') business_id: string,
  ) {
    const result = await this.accountClientService.dashGetAccounts(public_key, business_id);
    return result;
  }

  @Get('/dash/account/bank-details/:id')
  @HttpCode(200)
  async dashGetBankAccount(@Param('id') id: string) {
    const result = await this.accountClientService.dashGetBankAccount(id);
    return result;
  }

  @Get('/dash/identity/:id')
  @HttpCode(200)
  async dashGetIdentity(@Param('id') id: string) {
    const result = await this.accountClientService.dashGetIdentity(id);
    return result;
  }
}
