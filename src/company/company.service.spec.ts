import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { DatabaseService } from 'src/database/database.service';

const mockDb = {
  company: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: DatabaseService,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    mockDb.$transaction.mockImplementation(async (args) => {
      const findManyResult = await args[0];
      const countResult = await args[1];
      return [findManyResult, countResult];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated companies', async () => {
      const companies = [{ id: 1, nameFa: 'Company 1' }];
      const totalItems = 1;
      mockDb.company.findMany.mockResolvedValue(companies);
      mockDb.company.count.mockResolvedValue(totalItems);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual({
        data: companies,
        totalItems,
        totalPages: 1,
        currentPage: 1,
      });
      expect(mockDb.company.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          persons: {
            include: {
              person: true,
            },
          },
        },
        skip: 0,
        take: 10,
      });
    });

    it('should handle search query', async () => {
      await service.findAll({ q: 'test' });
      expect(mockDb.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { nameFa: { contains: 'test', mode: 'insensitive' } },
              { nameEn: { contains: 'test', mode: 'insensitive' } },
              { nationalId: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should not include persons if pageSize is 50 or more', async () => {
      await service.findAll({ pageSize: 50 });
      expect(mockDb.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: undefined,
        }),
      );
    });
  });
});