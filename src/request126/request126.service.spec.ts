import { Test, TestingModule } from '@nestjs/testing';
import { Request126Service } from './request126.service';
import { DatabaseService } from '../database/database.service';

describe('Request126Service', () => {
  let service: Request126Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Request126Service,
        {
          provide: DatabaseService,
          useValue: {
            request126: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Request126Service>(Request126Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
