import { Test, TestingModule } from '@nestjs/testing';
import { LineDosageService } from './line-dosage.service';

describe('LineDosageService', () => {
  let service: LineDosageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineDosageService],
    }).compile();

    service = module.get<LineDosageService>(LineDosageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
