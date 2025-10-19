import { Test, TestingModule } from '@nestjs/testing';
import { Request126HistoryController } from './request126-history.controller';
import { Request126HistoryService } from './request126-history.service';

describe('Request126HistoryController', () => {
  let controller: Request126HistoryController;
  let service: Request126HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Request126HistoryController],
      providers: [
        {
          provide: Request126HistoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByRequest: jest.fn(),
            findByActor: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<Request126HistoryController>(Request126HistoryController);
    service = module.get<Request126HistoryService>(Request126HistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service dependency', () => {
    expect(service).toBeDefined();
  });
});