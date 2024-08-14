import { Test, TestingModule } from '@nestjs/testing';
import { InsightController } from './insight.controller';
import { InsightService } from './insight.service';

describe('InsightController', () => {
  let insightController: InsightController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InsightController],
      providers: [InsightService],
    }).compile();

    insightController = app.get<InsightController>(InsightController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(insightController.getHello()).toBe('Hello World!');
    });
  });
});
