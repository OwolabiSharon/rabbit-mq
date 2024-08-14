import {
    BadRequestException, 
    Body, 
    Controller, 
    Get, 
    Post, 
    Req, 
    Res, 
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    Query
} from '@nestjs/common';
import {AuthService} from '../services/auth.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { CustomRequest } from '@app/common/utils/response';
import { BvnLookupQueryDto } from '../dto/bvn-lookup.dto';



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
    ) {
    }

    @Post('register')
    async register(
        @Body() data: CreateUserDto
    ) {
        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await this.authService.create({
            name: data.name,
            email:data.email,
            bvn:data.bvn,
            password: hashedPassword
        });

        delete user.password;

        return {
            message: "created successfully",
            data: user
        };
    }

    @Post('login')
    async login(
        @Body() data: LoginUserDto,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.authService.findOne(data.email);

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }

        if (!user.is_verified) {
            throw new BadRequestException('Please verify your email');
        }

        if (!await bcrypt.compare(data.password, user.password)) {      
            throw new BadRequestException('invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return {
            message: 'success', jwt
        };
    }

    @Get('bvn-advance/:public_key')
    @HttpCode(200)
    async bvnAdvance(@Query() data: BvnLookupQueryDto, @Req() request: CustomRequest) {
        console.log("iworked till here");
      const result = await this.authService.bvnAdvance(data, request.middlewareInfo);
      console.log(result);
      
      return result;
    }

    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];

            const data = await this.jwtService.verifyAsync(cookie);


            if (!data) {
                throw new UnauthorizedException({});
            }

            const user = await this.authService.findById(data['id']);

            const {password, ...result} = user;

            return result;
        } catch (e) {
            throw new UnauthorizedException({});
        }
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'success'
        }
    }
}
