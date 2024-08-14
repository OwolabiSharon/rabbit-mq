import { Test, TestingModule } from '@nestjs/testing';
import { KudaController } from './kuda.controller';

describe('KudaController', () => {
  let controller: KudaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KudaController],
    }).compile();

    controller = module.get<KudaController>(KudaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
