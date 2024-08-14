import { BusinessRolesEntity, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserBusinessService {
  private readonly logger = new Logger(GetUserBusinessService.name);
  constructor(
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
  ) {}

  async execute(user_id: string) {
    try {
      const collaborator = await this.collaboratorRepo.find({
        where: { user_id },
        relations: ['business'],
      });
      return collaborator;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
