import { MAIL_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject(MAIL_SERVICE)
    private mailClient: ClientProxy,
  ) {}

  async appTest(data: any) {
    this.mailClient.emit('user_created_mail', { data });
    return data;
  }
}
