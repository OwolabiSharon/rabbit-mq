import { Test, TestingModule } from '@nestjs/testing';
import { BvnController } from './bvn.controller';

describe('BvnController', () => {
  let controller: BvnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BvnController],
    }).compile();

    controller = module.get<BvnController>(BvnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
