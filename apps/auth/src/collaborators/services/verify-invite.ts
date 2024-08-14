import {
  BadRequestErrorException,
  BusinessRolesEntity,
  NotFoundErrorException,
  User,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifyInviteDto } from '../dto/verify-invite.dto';

@Injectable()
export class VerifyInvite {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
  ) {}

  async execute(data: VerifyInviteDto) {
    try {
      const payload = await new VerifyInviteDto().toEntity(data);
      const collaboratorRecord = await this.collaboratorRepo.findOne({
        where: { email: payload.email },
      });
      if (!collaboratorRecord) {
        throw new NotFoundErrorException('Collaborator invite does not exist');
      }
      console.log(collaboratorRecord)
      if (collaboratorRecord.invite_expiration_date < new Date(Date.now())) {
        throw new BadRequestErrorException('Invitation is expired');
      }

      payload.invite_expiration_date = null;

      await this.collaboratorRepo.update({ email: payload.email }, payload);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
