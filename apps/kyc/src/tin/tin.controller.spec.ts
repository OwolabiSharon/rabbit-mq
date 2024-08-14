import { Test, TestingModule } from '@nestjs/testing';
import { TinController } from './tin.controller';

describe('TinController', () => {
  let controller: TinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TinController],
    }).compile();

    controller = module.get<TinController>(TinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
