import { Test, TestingModule } from '@nestjs/testing';
import { PassportController } from './passport.controller';

describe('PassportController', () => {
  let controller: PassportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassportController],
    }).compile();

    controller = module.get<PassportController>(PassportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
