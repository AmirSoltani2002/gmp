import { Test, TestingModule } from '@nestjs/testing';
import { LineDosageService } from './line-dosage.service';
import { DatabaseService } from 'src/database/database.service';

describe('LineDosageService', () => {
  let service: LineDosageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineDosageService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    service = module.get<LineDosageService>(LineDosageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
