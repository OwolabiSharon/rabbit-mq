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
import {Response, Request} from 'express';
import { FetchAnalytics } from '../dto/fetch-analytics.dto';
import { ConnectService } from '../services/connect.service';
import { toggleDataAccess } from '../dto/toggle-data-access.dto';
import { GenerateAnalytics } from '../dto/generate-analysis';



@Controller('connect')
export class ConnectController {
    constructor(
        private readonly connectService: ConnectService,
    ) {
    }

    @Post('generate_analysis')
    async generate(
        @Body() data: GenerateAnalytics
    ) {
        
        const response = await this.connectService.getFinancialAnalytics(data)

        return {
            message: "generated successfully",
            data: response
        };
    }

    @Post('fetch_analysis')
    async fetch(
        @Body() data: FetchAnalytics
    ) {
        const response = await this.connectService.fetchAnalytics(data)

        return {
            message: "fetched successfully",
            data: response
        };
    }

    @Post('fetch_cash_flow_analysis')
    async getCashFlowAnalysis(
        @Body() data: FetchAnalytics
    ) {
        const response = await this.connectService.getCashFlowAnalysis(data)

        return {
            message: "fetched successfully",
            data: response
        };
    }
    
    @Post('toggle_data_access')
    async toggle(
        @Body() data: toggleDataAccess
    ) {
        const response = await this.connectService.toggleDataAccess(data)

        return {
            message: "changed successfully",
            data: response
        };
    }
}
