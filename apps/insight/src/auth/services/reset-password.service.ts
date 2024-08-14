import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import * as crypto from 'crypto';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';

@Injectable()
export class ResetPasswordService {
  private readonly logger = new Logger(ResetPasswordService.name);
  constructor(
    @InjectRepository(InsightsUser)
    private readonly usersRepository: Repository<InsightsUser>,
  ) {}
  async execute(data: ForgotPasswordDto) {
    try {
      const payload = await new ForgotPasswordDto().toEntity(data);
      const { email, password, password_token } = payload;
      const userRecord = await this.usersRepository.findOne({
        where: { email },
      });
      if (userRecord) {
        if (
          userRecord.password_token_expiration > new Date(Date.now()) &&
          userRecord.password_token === password_token
        ) {
          await this.usersRepository.update(
            { id: userRecord.id },
            { password, password_token: null, password_token_expiration: null },
          );
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
