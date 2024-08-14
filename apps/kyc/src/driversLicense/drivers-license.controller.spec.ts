import { Test, TestingModule } from '@nestjs/testing';
import { DriversLicenseController } from './drivers-license.controller';

describe('DriversLicenseController', () => {
  let controller: DriversLicenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversLicenseController],
    }).compile();

    controller = module.get<DriversLicenseController>(DriversLicenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
