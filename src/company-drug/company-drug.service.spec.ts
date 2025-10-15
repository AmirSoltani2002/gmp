import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDrugService } from './company-drug.service';
import { DatabaseService } from 'src/database/database.service';

const mockDatabaseService = {
  companyDrug: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CompanyDrugService', () => {
  let service: CompanyDrugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyDrugService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CompanyDrugService>(CompanyDrugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a company-drug', async () => {
    const createCompanyDrugDto = {
      drugId: 1,
      brandOwnerId: 1,
      IRC: '1234567890',
      brandNameEn: 'Test Brand',
      status: 'Test Status',
      supplierId: 1,
      producerId: 1,
    };
    await service.create(createCompanyDrugDto);
    expect(mockDatabaseService.companyDrug.create).toHaveBeenCalledWith({
      data: createCompanyDrugDto,
    });
  });

  it('should find all company-drugs', async () => {
    await service.findAll();
    expect(mockDatabaseService.companyDrug.findMany).toHaveBeenCalled();
  });

  it('should find one company-drug', async () => {
    const id = 1;
    await service.findOne(id);
    expect(mockDatabaseService.companyDrug.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should update a company-drug', async () => {
    const id = 1;
    const updateCompanyDrugDto = {
      brandNameEn: 'Updated Brand',
    };
    await service.update(id, updateCompanyDrugDto);
    expect(mockDatabaseService.companyDrug.update).toHaveBeenCalledWith({
      where: { id },
      data: updateCompanyDrugDto,
    });
  });

  it('should delete a company-drug', async () => {
    const id = 1;
    await service.remove(id);
    expect(mockDatabaseService.companyDrug.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});