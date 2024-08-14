import { App } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAppDto } from '../dto';

@Injectable()
export class EditAppService {
  private readonly logger = new Logger(EditAppService.name);
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async execute(data: UpdateAppDto, id: string) {
    try {
      const payload = await new UpdateAppDto().updateEntity(data);
      await this.appRepo.update(id, payload);
      const app = await this.appRepo.findOne({ where: { id } });
      return await this.preparedAppResponse(app);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async preparedAppResponse(app: App) {
    const data = await new UpdateAppDto().fromEntity(app);
    return data;
  }
}
