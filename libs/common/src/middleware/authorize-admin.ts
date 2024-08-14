import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction } from 'express';
import { Repository } from 'typeorm';
import { User } from '../database';
import { UnAuthorizedErrorException } from '../filters';
import { CustomRequest } from '../utils/response';

@Injectable()
export class AuthorizeAminMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const { id } = req.user;

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user.is_admin) {
      throw new UnAuthorizedErrorException('You do not have permission to perform this action');
    }
    next();
  }
}
