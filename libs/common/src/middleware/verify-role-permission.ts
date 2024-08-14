import { Role } from '@app/common/database/models/role.entity';
import { CustomRequest } from '@app/common/utils/response';
import { Permissions } from '@app/common/utils/roles';
import { Injectable, mixin, NestMiddleware, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { Repository } from 'typeorm';

export function VerifyRolePermission(role: Permissions): Type<NestMiddleware> {
  @Injectable()
  class VerifyRolePermissionMiddleware implements NestMiddleware {
    constructor(
      @InjectRepository(Role)
      private readonly roleRepo: Repository<Role>,
    ) {}
    async use(req: CustomRequest, res: Response, next: NextFunction) {
      const role_id = req.headers['role_id'] as string;
      console.log('role', role_id);
      const roleValue = await this.roleRepo.findOne({ where: { id: role_id } });
      if (!roleValue.permissions.includes(role))
        return res.status(403).json({
          message: 'you do not have persmission to perform this action',
          path: req.url,
          data: {},
        });
      next();
    }
  }
  return mixin(VerifyRolePermissionMiddleware);
}
