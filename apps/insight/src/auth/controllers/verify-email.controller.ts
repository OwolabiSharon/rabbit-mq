import {
    Body, 
    Controller, 
    Post, 
    HttpStatus,
} from '@nestjs/common';

import { VerifyEmailDto } from '../dto/verify-email.dto';
import { VerifyEmailService } from '../services/verify-email';


@Controller('verify')
export class Verify_email {
    constructor(
    private readonly VerifyEmailService: VerifyEmailService
    ) {}

        @Post('verify-email')
        async verifyEmail(@Body() data: VerifyEmailDto){
        await this.VerifyEmailService.execute(data);
        return ({
            message: 'Email verified',
            code: HttpStatus.OK,
            data: null,
        });
        }

    }