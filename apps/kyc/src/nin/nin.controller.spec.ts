import { Test, TestingModule } from '@nestjs/testing';
import { NinController } from './nin.controller';

describe('NinController', () => {
  let controller: NinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NinController],
    }).compile();

    controller = module.get<NinController>(NinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
