import { Test, TestingModule } from '@nestjs/testing';
import { Request126Service } from './request126.service';

describe('Request126Service', () => {
  let service: Request126Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Request126Service],
    }).compile();

    service = module.get<Request126Service>(Request126Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
