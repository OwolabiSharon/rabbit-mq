import { Test, TestingModule } from '@nestjs/testing';
import { SelfieController } from './selfie.controller';

describe('SelfieController', () => {
  let controller: SelfieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelfieController],
    }).compile();

    controller = module.get<SelfieController>(SelfieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
