import { Business, BusinessRolesEntity, ConflictErrorException, User } from '@app/common';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendInviteMail } from '../../helpers/mails/send-invite';
import { SendInviteDto } from '../dto';

@Injectable()
export class SendInviteService {
  private readonly logger = new Logger(SendInviteService.name);
  constructor(
    @InjectRepository(Business)
    private readonly BusinessRepo: Repository<Business>,

    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,

    private readonly sendInviteMail: SendInviteMail,
  ) {}

  async execute(data: SendInviteDto) {
    try {
      const payload = await new SendInviteDto().toEntity(data);
      const business = await this.BusinessRepo.findOne({
        where: {
          id: payload.business_id,
        },
        relations: ['user'],
      });
      if (!business) throw new NotFoundException('business not found');
      // //check if this user exist in table
      const doesUserExistInRolesTable = await this.collaboratorRepo.findOne({
        where: {
          email: payload.email,
          business_id: payload.business_id,
        },
      });
      if (doesUserExistInRolesTable) throw new ConflictErrorException('user already exist');
      const date = 1000 * 60 * 60 * 24 * 7;
      payload.invite_expiration_date = new Date(Date.now() + date);
      const result = await this.collaboratorRepo.save(payload);
      const { email, business_id } = payload;
      await this.sendInviteMail.execute(
        email,
        business_id,
        business.name,
        business.user.first_name,
        business.user.email,
      );
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
