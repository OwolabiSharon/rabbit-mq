import { Controller, Get, HttpCode, Param } from '@nestjs/common';

@Controller('hello-world')
export class HelloWorldController {
  @Get(':name')
  @HttpCode(200)
  helloWorld(@Param('id') name: string) {
    return `Hello ${name}!`;
  }
}
