import { Test, TestingModule } from '@nestjs/testing';
import { GtbController } from './gtb.controller';

describe('GtbController', () => {
  let controller: GtbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GtbController],
    }).compile();

    controller = module.get<GtbController>(GtbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
