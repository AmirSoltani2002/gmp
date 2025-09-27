import { Test, TestingModule } from '@nestjs/testing';
import { LineDosageController } from './line-dosage.controller';
import { LineDosageService } from './line-dosage.service';

describe('LineDosageController', () => {
  let controller: LineDosageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineDosageController],
      providers: [LineDosageService],
    }).compile();

    controller = module.get<LineDosageController>(LineDosageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
