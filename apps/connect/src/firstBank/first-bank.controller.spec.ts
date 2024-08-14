import { Test, TestingModule } from '@nestjs/testing';
import { FirstBankController } from './first-bank.controller';

describe('FirstBankController', () => {
  let controller: FirstBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstBankController],
    }).compile();

    controller = module.get<FirstBankController>(FirstBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
