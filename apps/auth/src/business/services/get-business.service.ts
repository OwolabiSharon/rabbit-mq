import { Business } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetBusinessService {
  private readonly logger = new Logger(GetBusinessService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async execute(user_id) {
    try {
      console.log('user_id');
      const result = this.businessRepo
        .createQueryBuilder('business')
        .leftJoinAndSelect('business.app', 'app')
        .leftJoinAndSelect('business.role', 'roles')
        .leftJoinAndSelect('business.collaborators', 'collaborators')
        .where('collaborators.user_id = :user_id', { user_id })
        .getMany();
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
