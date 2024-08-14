import { Test, TestingModule } from '@nestjs/testing';
import { VinController } from './vin.controller';

describe('VinController', () => {
  let controller: VinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinController],
    }).compile();

    controller = module.get<VinController>(VinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
