import { App, GenerateKey } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppDto } from '../dto';

@Injectable()
export class CreateAppService {
  private readonly logger = new Logger(CreateAppService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async createApp(data: CreateAppDto) {
    try {
      // generate public and secret key
      const payload = await new CreateAppDto().toEntity(data);
      payload.public_key = `pk_${GenerateKey()}`;
      payload.private_key = `pv_${GenerateKey()}`;
      payload.sandbox_key = `sb_${GenerateKey()}`;
      console.log(payload);
      const result = await this.appRepo.save(payload);
      return await this.preparedAppResponse(result);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async preparedAppResponse(app: App) {
    const data = await new CreateAppDto().fromEntity(app);
    return data;
  }
}
