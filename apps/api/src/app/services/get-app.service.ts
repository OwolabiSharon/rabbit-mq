import { App } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetAppService {
  private readonly logger = new Logger(GetAppService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async execute(business_id: string, id: string) {
    try {
      const app = await this.appRepo.find({ where: { id, business_id } });
      return app;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
