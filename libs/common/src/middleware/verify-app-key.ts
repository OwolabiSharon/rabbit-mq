import { App, Business, CustomerAccount } from '@app/common';
import {
  BadRequestException,
  Injectable,
  mixin,
  NestMiddleware,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

interface CustomRequest extends Request {
  middlewareInfo?: {
    business_id: string;
    private_key: string;
    charges: number;
    account: CustomerAccount[];
  };
}
export function AuthMiddlewareCreator(charges: number): Type<NestMiddleware> {
  @Injectable()
  class VerifyAppKeyMiddleware implements NestMiddleware {
    constructor(
      @InjectRepository(App)
      private readonly appRepo: Repository<App>,
      @InjectRepository(CustomerAccount)
      private readonly accountRepo: Repository<CustomerAccount>,
      @InjectRepository(Business)
      private readonly businessRepo: Repository<Business>,
    ) {}

    async use(req: CustomRequest, res: Response, next: NextFunction) {
      const { public_key } = req.params;
      if (!public_key) {
        throw new BadRequestException('public key is required');
      }

      // get private key from headers
      const private_key = req.headers['zeeh-private-key'] as string;
      if (!private_key) {
        throw new NotFoundException('Private key is required');
      }

      const app = await this.appRepo.findOne({
        where: { public_key, private_key },
      });

      if (!app) {
        res.status(400).json({});
        return;
      }

      const account = await this.accountRepo.find({ where: { public_key } });

      // check if balance is sufficient
      const balance = await this.businessRepo.findOne({
        where: { id: app.business_id },
      });
      if (!balance || balance.balance < charges) {
        res.status(400).json({
          message: 'Please fund your wallet to make this request, Insufficient balance',
          path: req.url,
          data: {},
        });
      }

      req.middlewareInfo = {
        business_id: app.business_id,
        private_key,
        charges,
        account,
      };

      next();
    }
  }
  return mixin(VerifyAppKeyMiddleware);
}
