import { Test, TestingModule } from '@nestjs/testing';
import { DosageService } from './dosage.service';
import { DatabaseService } from 'src/database/database.service';

describe('DosageService', () => {
  let service: DosageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DosageService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    service = module.get<DosageService>(DosageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
