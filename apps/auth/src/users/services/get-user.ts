import { User } from '@app/common';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetUserService {
  private readonly logger = new Logger(GetUserService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async execute(id: string) {
    try {
      return this.usersRepository.findOne({ where: {id} });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}