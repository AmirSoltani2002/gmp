import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDrugController } from './company-drug.controller';
import { CompanyDrugService } from './company-drug.service';

describe('CompanyDrugController', () => {
  let controller: CompanyDrugController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyDrugController],
      providers: [CompanyDrugService],
    }).compile();

    controller = module.get<CompanyDrugController>(CompanyDrugController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
