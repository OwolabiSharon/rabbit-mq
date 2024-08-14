import { Role } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddRoleDto } from '../dto/add-role.dto';

@Injectable()
export class AddRoleService {
  private readonly logger = new Logger(AddRoleService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async execute(data: AddRoleDto) {
    try {
      const payload = await new AddRoleDto().toEntity(data);
      const role = await this.roleRepo.save(payload);
      return role;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
