import { User } from '@app/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateProfileService {
  private readonly logger = new Logger(UpdateProfileService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(data: UpdateUserProfileDto, id: string) {
    try {
      const payload = await new UpdateUserProfileDto().toEntity(data);
      await this.userRepo.update(id, payload);
      const user = await this.userRepo.findOne({ where: { id } });
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
