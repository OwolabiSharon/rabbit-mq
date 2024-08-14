import { BusinessRolesEntity, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteInviteService {
  private readonly logger = new Logger(DeleteInviteService.name);
  constructor(
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
  ) {}

  async execute(data: { email: string; business_id: string }) {
    try {
      const { email, business_id } = data;
      await this.collaboratorRepo.delete({ email, business_id });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
