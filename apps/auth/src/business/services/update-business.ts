import { Business, BusinessRolesEntity, UnVerifiedBusiness, User } from '@app/common';
import { Role } from '@app/common/database/models/role.entity';
import { DefaulRoles, Roles } from '@app/common/utils/roles';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from '../api/balance.api';
import { verifyBusiness } from '../api/verify-business.api';
import { UpdateBusinessDto } from '../dto/update-business.dto';

@Injectable()
export class UpdateBusinessService {
  private readonly logger = new Logger(UpdateBusinessService.name);
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(BusinessRolesEntity)
    private readonly collaboratorRepo: Repository<BusinessRolesEntity>,
    @InjectRepository(UnVerifiedBusiness)
    private readonly unverifiedRepo: Repository<UnVerifiedBusiness>,
  ) {}

  async execute(data: UpdateBusinessDto, id: string, user_id: string) {
    try {
      const payload = await new UpdateBusinessDto().updateEntity(data);
      const verified = await verifyBusiness(payload.registration_number, payload.name);
      if (!verified) {
        throw new UnprocessableEntityException('Error fetching CAC to verify Business');
      }
      const { email } = await this.userRepo.findOne({ where: { id: user_id } });
      const roleData = DefaulRoles(id);
      await this.roleRepo.save(roleData);
      const roleRecord = await this.roleRepo.findOne({
        where: { business_id: id, user_type: Roles.Owner },
      });

      const collaboratorPayload = {
        user_id,
        email,
        business_id: id,
        status: 'Active',
        invite_expiration_date: null,
        role_id: roleRecord.id,
      };

      await this.collaboratorRepo.save(collaboratorPayload);

      payload.is_business_verified = true;
      payload.verified_date = new Date();
      const { balance, currency } = Balance(payload.country);
      payload.balance = balance;
      payload.currency = currency;

      if (payload.country === 'kenya') {
        const { name, registration_address, registration_number, country } = payload;
        const business = await this.unverifiedRepo.save({
          user_id,
          business_id: id,
          name,
          country,
          registration_address,
          registration_number,
        });
        return {
          msg: 'Business details are submitted and awaiting verification',
          business,
        };
      }

      await this.businessRepo.update(id, payload);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
