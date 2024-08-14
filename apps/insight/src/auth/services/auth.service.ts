import { BadRequestException, Inject, Injectable, Logger,UnauthorizedException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { customAlphabet } from "nanoid";
import { randomBytes } from 'crypto';
import { InsightsUser } from '@app/common/database/models/insights_user_model/insights_user.entity';
import { catchError, Observable, tap } from 'rxjs';


import { KYC_SERVICE, NG_KYC_BVN_ADVANCE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { SelfieBvnQueryDto } from 'apps/kyc/src/bvn/dto/selfie-bvn.dto';
import { middlewareInfoType } from 'apps/kyc/types';
import { UserVerificationMail } from 'apps/auth/src/helpers/mails/user-verification.mail';
import { BvnLookupQueryDto } from '../dto/bvn-lookup.dto';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(InsightsUser)
        private readonly insightsRepo: Repository<InsightsUser> ,

        @InjectRepository(NG_KYC_BVN_ADVANCE)
        private readonly NG_KYC_BVN_ADVANCE: Repository<NG_KYC_BVN_ADVANCE> ,

        @Inject(KYC_SERVICE) private bvnClient: ClientProxy,

        private readonly userVerificationMail: UserVerificationMail,

        ) {}

    async create(data: any): Promise<InsightsUser> {
        
        const verificationToken = randomBytes(40).toString('hex');
        const _7d = 1000 * 60 * 60 * 24 * 7;
        const verificationTokenExpiration = new Date(Date.now() + _7d);
        data.verification_token = verificationToken;
        data.verification_token_expiration = verificationTokenExpiration;
        const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 8)
        
        
        
        try {
            
            const user = await this.insightsRepo.save({
                name: data.name, 
                email: data.email,
                password: data.password,
                bvn: data.bvn,
                zeeh_id: nanoid()
            });
            
            if (!user) {
                throw new BadRequestException("Bad request");
                
            } else {
                console.log(verificationToken);
                await this.userVerificationMail.execute( user.zeeh_id, user.email, verificationToken);  
                return user
            }
            
            
        } catch (error) {
            throw new BadRequestException(error);
        }
        
    }

    async bvnAdvance(data: BvnLookupQueryDto, middlewareInfo: middlewareInfoType) 
    {
        console.log("iworked till here");
        try {
            const user = await this.insightsRepo.findOne(
                { where:
                    {email: data.email}
                }
            );
        console.log("iworked till here");
        
          const bvnLookup = await this.bvnClient.send({ cmd: 'bvn-advance-lookup' }, { bvn: data.bvn, middlewareInfo })
          .pipe(
            tap((res) => {
              console.log(res);
              
            }),
            catchError(() => {
              throw new UnauthorizedException();
            }),
          );
        //    user.bvn_info = bvnLookup
        //    const newUser = await this.insightsRepo.save(user)
          return bvnLookup
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findOne(email: any): Promise<InsightsUser> {
        try {
            const user = await this.insightsRepo.findOne(
                { where:
                    {email}
                }
            ); 
            
            if (!user) { 
                throw new BadRequestException("Not Found");
            } else {
                return user
               
            }
        } catch (error) {
            console.log(error);
            
            throw new BadRequestException(error);
        }
    }

    async findById(id: any): Promise<InsightsUser> {
        try {
            const user = await this.insightsRepo.findOne(
                { where:
                    {id}
                }
            );
            
            if (!user) { 
                throw new BadRequestException("Not Found");
            } else {
                return user
               
            }
        } catch (error) {
            
            throw new BadRequestException(error);
        }
        
       
    }
}
