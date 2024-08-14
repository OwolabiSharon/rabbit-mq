import { Controller, Get } from '@nestjs/common';
import { InsightService } from './insight.service';

@Controller()
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Get()
  getHello(): string {
    return this.insightService.getHello();
  }
}
