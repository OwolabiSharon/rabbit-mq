import { App } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetAppByNameService {
  private readonly logger = new Logger(GetAppByNameService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async execute(app_name: string) {
    try {
      const app = app_name.includes('pk_')
        ? await this.appRepo.findOne({ where: { app_name } })
        : await this.appRepo.findOne({ where: { public_key: app_name } });

      return {
        public_key: app.public_key,
        company_logo: app.logo,
        company_name: app.app_name,
        business_id: app.business_id,
      };
      return app;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
