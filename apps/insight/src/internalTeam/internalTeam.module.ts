import  { MiddlewareConsumer, Module, NestModule, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User,Business,ApiCall } from '@app/common';

import { InternalTeamService } from './internalTeam.service';
import { ConnectController } from './internalTeam.controller';



    
@Global()
@Module({
    imports:[
        TypeOrmModule.forFeature([User, Business,ApiCall ]),
    ],
    providers: [
        InternalTeamService
    ],
    controllers: [
        ConnectController
    ]
})
export class InternalTeamModule{}