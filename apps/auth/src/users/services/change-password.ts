import { User } from '@app/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class ChangePasswordService {
  private readonly logger = new Logger(ChangePasswordService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(data: ChangePasswordDto, user_id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      const passwordIsValid = await bcrypt.compare(
        data.current_password,
        user.password,
      );

      if (!passwordIsValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      data.new_password = await bcrypt.hash(data.new_password, 10);

      const payload = await new ChangePasswordDto().toEntity(data);

      await this.userRepo.update({ id: user_id }, payload);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
