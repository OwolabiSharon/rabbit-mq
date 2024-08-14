import { successResponse, SuccessResponseType } from '@app/common/utils/response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SendInviteDto } from './dto';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { VerifyInviteDto } from './dto/verify-invite.dto';
import { AddRoleService } from './services/add-role';
import { ChangeRoleService } from './services/change-role';
import { DeleteInviteService } from './services/delete-invite';
import { GetRoleService } from './services/get-roles';
import { RemoveMemberService } from './services/remove-member';
import { SendInviteService } from './services/send-invite';
import { VerifyInvite } from './services/verify-invite';

@Controller('collaborator')
export class CollaboratorController {
  constructor(
    private sendInviteService: SendInviteService,
    private verifyInviteService: VerifyInvite,
    private removeMemberService: RemoveMemberService,
    private deleteInviteService: DeleteInviteService,
    private addRoleService: AddRoleService,
    private changeRoleService: ChangeRoleService,
    private getRoleService: GetRoleService,
  ) {}

  @Post('send-invite')
  @HttpCode(200)
  async sendInvite(@Body() body: SendInviteDto): Promise<SuccessResponseType> {
    const result = await this.sendInviteService.execute(body);
    return successResponse({
      message: 'Invite has been sent',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }

  @Post('verify-invite')
  @HttpCode(200)
  async verifyInvite(@Body() body: VerifyInviteDto): Promise<SuccessResponseType> {
    await this.verifyInviteService.execute(body);
    return successResponse({
      message: 'Invitation verified',
      code: HttpStatus.OK,
      status: 'success',
    });
  }

  @Delete('remove-member/:collaborator_id')
  @HttpCode(200)
  async removeMember(
    @Param('collaborator_id') collaborator_id: string,
  ): Promise<SuccessResponseType> {
    await this.removeMemberService.execute(collaborator_id);
    return successResponse({
      message: 'Collaborator removed',
      code: HttpStatus.OK,
      status: 'success',
    });
  }

  @Delete('delete-invite')
  @HttpCode(200)
  async deleteInvite(
    @Body() data: { email: string; business_id: string },
  ): Promise<SuccessResponseType> {
    await this.deleteInviteService.execute(data);
    return successResponse({
      message: 'Invite deleted',
      code: HttpStatus.OK,
      status: 'success',
    });
  }

  @Post('add-role')
  @HttpCode(200)
  async addRole(@Body() body: AddRoleDto): Promise<SuccessResponseType> {
    const result = await this.addRoleService.execute(body);
    return successResponse({
      message: 'Role created',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }

  @Patch('change-role/:collaborator_id')
  @HttpCode(200)
  async changeRole(
    @Param('collaborator_id') collaborator_id: string,
    @Body() data: ChangeRoleDto,
  ): Promise<SuccessResponseType> {
    const result = await this.changeRoleService.execute(collaborator_id, data);
    return successResponse({
      message: 'Collaborator role changed',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }

  @Get('get-roles')
  @HttpCode(200)
  async getRoles(@Headers('business_id') business_id: string): Promise<SuccessResponseType> {
    const result = await this.getRoleService.execute(business_id);
    return successResponse({
      message: 'Roles fetched successfully',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }
}
