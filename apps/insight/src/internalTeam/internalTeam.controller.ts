import {
    BadRequestException, 
    Body, 
    Controller, 
    Get, 
} from '@nestjs/common';
import {Response, Request} from 'express';

import { InternalTeamService } from './internalTeam.service';



@Controller('internalTeam')
export class ConnectController {
    constructor(
        private readonly internalTeam: InternalTeamService,
    ) {
    }

    @Get('getAllUsers')
    async getAllUser(
        @Body() data: any
    ) {
        const response = await this.internalTeam.getAllUsers(data)

        return {
            message: "fetched successfully",
            data: response
        };
    }

    @Get('getAllCustomers')
    async getAllCustomers(
        @Body() data: any
    ) {
        const response = await this.internalTeam.getAllCustomer(data)

        return {
            message: "fetched successfully",
            data: response
        };
    }
}
