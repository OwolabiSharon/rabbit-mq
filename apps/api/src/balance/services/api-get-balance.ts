import { App, BadRequestErrorException, Business } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveApiCallService } from 'apps/connect/src/account/services/save-api-call';
import { Repository } from 'typeorm';

@Injectable()
export class ApiGetBalanceService {
  private readonly logger = new Logger(ApiGetBalanceService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    private readonly saveApiCall: SaveApiCallService,
  ) {}

  async execute(private_key: string, public_key: string) {
    try {
      if (!private_key) {
        throw new BadRequestErrorException('Private key is required');
      }

      const app = await this.appRepo.findOne({ where: { private_key, public_key } });
      if (!app) {
        return null;
      }

      await this.saveApiCall.execute({
        endpoint: 'wallet balance',
        private_key,
        business_id: app.business_id,
        status: 'success',
        amount: 0.0,
        source: 'Api',
      });

      const business = await this.businessRepo.findOne({ where: { id: app.business_id } });

      const { balance } = business;

      if (!balance) {
        throw new BadRequestErrorException('You have not funded your account');
      }

      return balance;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
