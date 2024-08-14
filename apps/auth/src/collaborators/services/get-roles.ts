import { Role, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetRoleService {
  private readonly logger = new Logger(GetRoleService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async execute(business_id: string) {
    try {
      const roles = await this.roleRepo.find({ where: { business_id } });
      return roles;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
