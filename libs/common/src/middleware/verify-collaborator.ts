import { Business } from '@app/common';
import { CustomRequest } from '@app/common/utils/response';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { Repository } from 'typeorm';

@Injectable()
export class VerifyCollaborator implements NestMiddleware {
  private readonly logger = new Logger(VerifyCollaborator.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const business_id = req.headers['business_id'] as string;
      console.log("yes", business_id)
      const user = req.user;

      console.log(user)

      const isUserStillActive = this.businessRepo
        .createQueryBuilder('business')
        .leftJoinAndSelect('business.collaborators', 'collaborator')
        .where('collaborator.user_id = :user_id', {
          user_id: user.id,
        })
        .where('business.id = :business_id', { business_id })
        .getMany();

      if (!isUserStillActive) {
        return res.status(401).json({
          message: 'you are no longer a team member of this business',
          path: req.url,
          data: {},
        });
      }
      next();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
