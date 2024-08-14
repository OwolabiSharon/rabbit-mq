import { Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import * as crypto from 'crypto';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { ForgotPasswordMail } from 'apps/auth/src/helpers/mails/forgot-password';

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);
  constructor(
    @InjectRepository(InsightsUser)
    private readonly usersRepository: Repository<InsightsUser>,
    private readonly forgotPasswordMail: ForgotPasswordMail,
  ) {}
  async execute(data: ForgotPasswordDto) {
    try {
      const { email } = await new ForgotPasswordDto().toEntity(data);
      const userRecord = await this.usersRepository.findOne({
        where: { email },
      });
      if (!userRecord) {
        throw new BadRequestException('Email does not exist');
      }
      const password_token = crypto.randomBytes(40).toString('hex');

      // set expiration for the resetToken
      const fiveMinutes = 1000 * 60 * 5;
      const password_token_expiration = new Date(Date.now() + fiveMinutes);

      await this.usersRepository.update(
        { id: userRecord.id },
        { password_token, password_token_expiration },
      );
      console.log(password_token);
      await this.forgotPasswordMail.execute(email, userRecord.bvn, password_token);
      
      
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
