import { Test, TestingModule } from '@nestjs/testing';
import { DrugService } from './drug.service';
import { DatabaseService } from 'src/database/database.service';

const mockDatabaseService = {
  drug: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('DrugService', () => {
  let service: DrugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<DrugService>(DrugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a drug', async () => {
    const createDrugDto = {
      drugIndexName: 'Test Drug',
      genericName: 'Test Generic',
      genericCode: 'T123',
      ATC: 'A12B',
      productType: 'Test Type',
    };
    await service.create(createDrugDto);
    expect(mockDatabaseService.drug.create).toHaveBeenCalledWith({
      data: createDrugDto,
    });
  });

  it('should find all drugs', async () => {
    await service.findAll();
    expect(mockDatabaseService.drug.findMany).toHaveBeenCalled();
  });

  it('should find one drug', async () => {
    const id = 1;
    await service.findOne(id);
    expect(mockDatabaseService.drug.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should update a drug', async () => {
    const id = 1;
    const updateDrugDto = {
      drugIndexName: 'Updated Drug',
    };
    await service.update(id, updateDrugDto);
    expect(mockDatabaseService.drug.update).toHaveBeenCalledWith({
      where: { id },
      data: updateDrugDto,
    });
  });

  it('should delete a drug', async () => {
    const id = 1;
    await service.remove(id);
    expect(mockDatabaseService.drug.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
