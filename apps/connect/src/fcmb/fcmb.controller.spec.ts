import { Test, TestingModule } from '@nestjs/testing';
import { FcmbController } from './fcmb.controller';

describe('FcmbController', () => {
  let controller: FcmbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmbController],
    }).compile();

    controller = module.get<FcmbController>(FcmbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
