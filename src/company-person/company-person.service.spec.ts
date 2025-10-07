import { Test, TestingModule } from '@nestjs/testing';
import { CompanyPersonService } from './company-person.service';
import { DatabaseService } from 'src/database/database.service';

describe('CompanyPersonService', () => {
  let service: CompanyPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyPersonService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    service = module.get<CompanyPersonService>(CompanyPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
