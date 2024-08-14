import { Test, TestingModule } from '@nestjs/testing';
import { NubanController } from './nuban.controller';

describe('NubanController', () => {
  let controller: NubanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NubanController],
    }).compile();

    controller = module.get<NubanController>(NubanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
