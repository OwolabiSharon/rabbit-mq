import { Injectable } from '@nestjs/common';

@Injectable()
export class InsightService {
  getHello(): string {
    return 'Hello World!';
  }
}
