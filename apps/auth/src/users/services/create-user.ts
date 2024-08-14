import { Business, BusinessRolesEntity, User } from '@app/common';
import { Injectable, UnprocessableEntityException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth.service';
import { Response } from 'express';
import { UserVerificationMail } from '../../helpers/mails/user-verification.mail';
import { randomBytes } from 'crypto';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,

    private readonly authService: AuthService,

    private readonly userVerificationMail: UserVerificationMail,
  ) {}

  async execute(request: CreateUserDto, response: Response) {
    try {
      const verificationToken = randomBytes(40).toString('hex');
      const _7d = 1000 * 60 * 60 * 24 * 7;
      const verificationTokenExpiration = new Date(Date.now() + _7d);
      request.verification_token = verificationToken;
      request.verification_token_expiration = verificationTokenExpiration;
      const payload = await new CreateUserDto().toEntity(request);
      payload.password = await bcrypt.hash(payload.password, 10);
      await this.validateCreateUserRequest(payload.email);
      const user = await this.usersRepository.save(payload);

      const business = await this.businessRepo.findOne({
        where: { user_id: user.id },
      });

      await this.userVerificationMail.execute(user.first_name, user.email, verificationToken);
      await this.authService.login(user, response);
      return response.send(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async validateCreateUserRequest(email: string) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    if (user) {
      await this.usersRepository.delete({ id: user.id });
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  private async prepareUserResponseData(business_id: string) {
    return business_id;
  }
}
