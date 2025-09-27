import { Test, TestingModule } from '@nestjs/testing';
import { DosageController } from './dosage.controller';
import { DosageService } from './dosage.service';

describe('DosageController', () => {
  let controller: DosageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DosageController],
      providers: [DosageService],
    }).compile();

    controller = module.get<DosageController>(DosageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
