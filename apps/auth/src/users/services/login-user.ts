import { Business, NotFoundErrorException, User } from '@app/common';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthService } from '../../auth.service';
import { Response } from 'express';
import { successResponse } from '@app/common/utils/response';

@Injectable()
export class LoginUserService {
  private readonly logger = new Logger(LoginUserService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,

    private readonly authService: AuthService,
  ) {}

  async execute(payload: LoginUserDto, response: Response) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if(!user){
        throw new NotFoundErrorException('User does not exist')
      }

      const passwordIsValid = await bcrypt.compare(payload.password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }

      const last_login = new Date();

      await this.usersRepository.update({ id: user.id }, { last_login });

      await this.authService.login(user, response);
      let result = await this.prepareUserResponseData(user);
      const res = successResponse({
        message: 'User logged in successfully.',
        code: 200,
        status: 'success',
        data: result,
      });
      response.status(200).send(res);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async prepareUserResponseData(payload: User) {
    const { id } = payload;
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['business'] });
    const data = await new LoginUserDto().fromEntity(user);
    return data;
  }
}
