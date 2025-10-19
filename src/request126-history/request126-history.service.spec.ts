import { Test, TestingModule } from '@nestjs/testing';
import { Request126HistoryService } from './request126-history.service';
import { DatabaseService } from '../database/database.service';

describe('Request126HistoryService', () => {
  let service: Request126HistoryService;
  let db: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Request126HistoryService,
        {
          provide: DatabaseService,
          useValue: {
            request126History: {
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
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
    db = module.get<DatabaseService>(DatabaseService);
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
    
    db.request126History.findUniqueOrThrow = jest.fn().mockResolvedValue(mockHistory);

    const result = await service.findOne(1);

    expect(db.request126History.findUniqueOrThrow).toHaveBeenCalledWith({
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
    
    db.request126History.create = jest.fn().mockResolvedValue(mockCreated);

    const result = await service.create(createDto);

    expect(db.request126History.create).toHaveBeenCalledWith({
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

    db.$transaction = jest.fn().mockResolvedValue([mockItems, mockCount]);

    const result = await service.findAll(query);

    expect(db.$transaction).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockItems,
      totalItems: mockCount,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10
    });
  });

  it('should update a history entry', async () => {
    const updateDto = { message: 'Updated message' };
    const mockUpdated = { 
      id: 1, 
      message: 'Updated message',
      action: 'approved'
    };
    
    db.request126History.update = jest.fn().mockResolvedValue(mockUpdated);

    const result = await service.update(1, updateDto);

    expect(db.request126History.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateDto,
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
    expect(result).toEqual(mockUpdated);
  });

  it('should delete a history entry', async () => {
    const historyId = 1;
    const mockDeleted = {
      id: 1,
      action: 'deleted',
    };
    
    db.request126History.delete = jest.fn().mockResolvedValue(mockDeleted);

    const result = await service.remove(historyId);

    expect(db.request126History.delete).toHaveBeenCalledWith({
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

  it('should find histories by request', async () => {
    const mockHistories = [
      {
        id: 1,
        requestId: 123,
        action: 'created'
      }
    ];
    
    db.request126History.findMany = jest.fn().mockResolvedValue(mockHistories);

    const result = await service.findByRequest(123);

    expect(db.request126History.findMany).toHaveBeenCalledWith({
      where: { requestId: 123 },
      orderBy: { createdAt: 'desc' },
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
    expect(result).toEqual(mockHistories);
  });

  it('should find histories by actor', async () => {
    const mockHistories = [
      {
        id: 1,
        actorId: 456,
        action: 'approved'
      }
    ];
    
    db.request126History.findMany = jest.fn().mockResolvedValue(mockHistories);

    const result = await service.findByActor(456);

    expect(db.request126History.findMany).toHaveBeenCalledWith({
      where: { actorId: 456 },
      orderBy: { createdAt: 'desc' },
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
    expect(result).toEqual(mockHistories);
  });
});