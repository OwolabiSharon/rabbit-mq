import { User } from '@app/common';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Injectable()
export class VerifyEmailService {
  private readonly logger = new Logger(VerifyEmailService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async execute(data: VerifyEmailDto) {
    try {
      const { email } = await new VerifyEmailDto().toEntity(data);
      const userRecord = await this.usersRepository.findOne({
        where: { email },
      });
      if (!userRecord) {
        throw new BadRequestException('Email does not exist');
      }
      const { id } = userRecord;
      const payload = await new VerifyEmailDto().updateEntity(data);
      payload.is_verified = true;
      payload.verified_date = new Date();
      payload.verification_token = '';
      payload.verification_token_expiration = null;

      await this.usersRepository.update(id, payload);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
