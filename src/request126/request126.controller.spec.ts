import { Test, TestingModule } from '@nestjs/testing';
import { Request126Controller } from './request126.controller';
import { Request126Service } from './request126.service';

describe('Request126Controller', () => {
  let controller: Request126Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Request126Controller],
      providers: [
        {
          provide: Request126Service,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<Request126Controller>(Request126Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
