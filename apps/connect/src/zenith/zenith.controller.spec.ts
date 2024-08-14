import { Test, TestingModule } from '@nestjs/testing';
import { ZenithController } from './zenith.controller';

describe('ZenithController', () => {
  let controller: ZenithController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZenithController],
    }).compile();

    controller = module.get<ZenithController>(ZenithController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
