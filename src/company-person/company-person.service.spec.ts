import { Test, TestingModule } from '@nestjs/testing';
import { CompanyPersonService } from './company-person.service';

describe('CompanyPersonService', () => {
  let service: CompanyPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyPersonService],
    }).compile();

    service = module.get<CompanyPersonService>(CompanyPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
