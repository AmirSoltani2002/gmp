import { Test, TestingModule } from '@nestjs/testing';
import { Request126HistoryService } from './request126-history.service';
import { DatabaseService } from '../database/database.service';

describe('Request126HistoryService', () => {
  let service: Request126HistoryService;
  let prisma: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Request126HistoryService,
        {
          provide: DatabaseService,
          useValue: {
            request126History: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Request126HistoryService>(Request126HistoryService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one history entry by id', async () => {
    const mockHistory = { 
      id: 1, 
      requestId: 1,
      actorId: 1,
      action: 'created',
      fromStatus: 'new',
      toStatus: 'pending',
      toAssigneeId: 2
    };
    
    prisma.request126History.findUnique = jest.fn().mockResolvedValue(mockHistory);

    const result = await service.findOne(1);

    expect(prisma.request126History.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
    expect(result).toEqual(mockHistory);
  });

  it('should create a new history entry', async () => {
    const createDto = {
      requestId: 1,
      actorId: 1,
      action: 'assigned',
      fromStatus: 'pending',
      toStatus: 'assigned',
      toAssigneeId: 2,
      message: 'Request assigned to quality team',
    };
    
    const mockCreated = { 
      id: 1, 
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    prisma.request126History.create = jest.fn().mockResolvedValue(mockCreated);

    const result = await service.create(createDto);

    expect(prisma.request126History.create).toHaveBeenCalledWith({
      data: {
        ...createDto,
        endedAt: null,
      },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
    expect(result).toEqual(mockCreated);
  });

  it('should find all with pagination and search', async () => {
    const query = {
      page: 1,
      pageSize: 10,
      q: 'approved'
    };

    const mockItems = [
      {
        id: 1,
        action: 'approved',
        toStatus: 'approved'
      }
    ];

    const mockCount = 1;

    prisma.$transaction = jest.fn().mockResolvedValue([mockItems, mockCount]);

    const result = await service.findAll(query);

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockItems,
      totalItems: mockCount,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10
    });
  });

  it('should delete a history entry', async () => {
    const historyId = 1;
    const mockDeleted = {
      id: 1,
      action: 'deleted',
    };
    
    prisma.request126History.delete = jest.fn().mockResolvedValue(mockDeleted);

    const result = await service.delete(historyId);

    expect(prisma.request126History.delete).toHaveBeenCalledWith({
      where: { id: historyId },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
    expect(result).toEqual(mockDeleted);
  });
});