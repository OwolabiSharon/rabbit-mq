import { BusinessRolesEntity, Role, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRoleDto } from '../dto/change-role.dto';

@Injectable()
export class ChangeRoleService {
  private readonly logger = new Logger(ChangeRoleService.name);
  constructor(
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
  ) {}

  async execute(collaborator_id: string, data: ChangeRoleDto) {
    try {
      const payload = await new ChangeRoleDto().toEntity(data);
      const { role_id } = payload;
      await this.collaboratorRepo.update({ id: collaborator_id }, { role_id });
      const collaborator = await this.collaboratorRepo.findOne({ where: { id: collaborator_id } });
      return collaborator;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
