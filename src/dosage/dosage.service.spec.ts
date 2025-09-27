import { Test, TestingModule } from '@nestjs/testing';
import { DosageService } from './dosage.service';

describe('DosageService', () => {
  let service: DosageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DosageService],
    }).compile();

    service = module.get<DosageService>(DosageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
