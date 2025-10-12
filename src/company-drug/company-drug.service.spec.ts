import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDrugService } from './company-drug.service';

describe('CompanyDrugService', () => {
  let service: CompanyDrugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyDrugService],
    }).compile();

    service = module.get<CompanyDrugService>(CompanyDrugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
