import { User } from '@app/common';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { UserVerificationMail } from '../../helpers/mails/user-verification.mail';

@Injectable()
export class ResendVerificationService {
  private readonly logger = new Logger(ResendVerificationService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly userVerificationMail: UserVerificationMail,
  ) {}
  async execute(data: ResendVerificationDto) {
    try {
      const { email } = await new ResendVerificationDto().toEntity(data);
      const userRecord = await this.usersRepository.findOne({
        where: { email },
      });
      if (!userRecord) {
        throw new BadRequestException('Email does not exist');
      }
      const payload = await new ResendVerificationDto().updateEntity(data);
      const { id } = userRecord;
      payload.verification_token = randomBytes(40).toString('hex');
      const _7d = 1000 * 60 * 60 * 24 * 7;
      payload.verification_token_expiration = new Date(Date.now() + _7d);

      await this.usersRepository.update(id, payload);

      await this.userVerificationMail.execute(
        userRecord.first_name,
        userRecord.email,
        payload.verification_token,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
