import {
  Business,
  BusinessRolesEntity,
  MAIL_SERVICE,
  RmqModule,
  User,
  VerifyCollaborator,
  VerifyRolePermission,
} from '@app/common';
import { Role } from '@app/common/database/models/role.entity';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorController } from './collaborator.controller';
import { ChangeRoleService } from './services/change-role';
import { SendInviteService } from './services/send-invite';
import { VerifyInvite } from './services/verify-invite';
import { DeleteInviteService } from './services/delete-invite';
import { RemoveMemberService } from './services/remove-member';
import { AddRoleService } from './services/add-role';
import { GetRoleService } from './services/get-roles';
import * as cookieParser from 'cookie-parser';
import { Permissions } from '@app/common/utils/roles';
import { AuthenticateUserMiddleware } from '@app/common/middleware/authenticate-keys';
import { SendInviteMail } from '../helpers/mails/send-invite';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BusinessRolesEntity, Business, Role]),
    RmqModule.register({ name: MAIL_SERVICE }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    ChangeRoleService,
    DeleteInviteService,
    RemoveMemberService,
    SendInviteService,
    VerifyInvite,
    AddRoleService,
    GetRoleService,
    SendInviteMail,
  ],
  exports: [],
  controllers: [CollaboratorController],
})
export class CollaboratorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser(), AuthenticateUserMiddleware).forRoutes('collaborator/*');
    consumer
      .apply(VerifyRolePermission(Permissions.TEAMS))
      .forRoutes(
        'collaborator/send-invite',
        'collaborator/remove-member/:collaborator_id',
        'collaborator/delete-invite',
        'collaborator/add-role',
        'collaborator/change-role/:collaborator_id',
      );

    consumer
      .apply(VerifyCollaborator)
      .forRoutes(
        'collaborator/send-invite',
        'collaborator/remove-member/:collaborator_id',
        'collaborator/delete-invite',
        'collaborator/add-role',
        'collaborator/change-role/:collaborator_id',
        'collaborator/get-roles',
      );
  }
}
