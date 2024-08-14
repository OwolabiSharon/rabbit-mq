import { Test, TestingModule } from '@nestjs/testing';
import { ConnectController } from './connect.controller';
import { ConnectService } from './connect.service';

describe('ConnectController', () => {
  let connectController: ConnectController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConnectController],
      providers: [ConnectService],
    }).compile();

    connectController = app.get<ConnectController>(ConnectController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(connectController.getHello()).toBe('Hello World!');
    });
  });
});
