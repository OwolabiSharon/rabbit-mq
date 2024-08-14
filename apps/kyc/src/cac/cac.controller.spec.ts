import { Test, TestingModule } from '@nestjs/testing';
import { CacController } from './cac.controller';

describe('CacController', () => {
  let controller: CacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacController],
    }).compile();

    controller = module.get<CacController>(CacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
