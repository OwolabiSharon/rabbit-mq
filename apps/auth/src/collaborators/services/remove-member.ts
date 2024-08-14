import { BusinessRolesEntity, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RemoveMemberService {
  private readonly logger = new Logger(RemoveMemberService.name);
  constructor(
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
  ) {}

  async execute(collaborator_id: string) {
    try {
      await this.collaboratorRepo.delete({ id: collaborator_id });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
