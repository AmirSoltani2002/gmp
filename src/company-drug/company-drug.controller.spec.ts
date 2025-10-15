import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDrugController } from './company-drug.controller';
import { CompanyDrugService } from './company-drug.service';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';

const mockCompanyDrugService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CompanyDrugController', () => {
  let controller: CompanyDrugController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyDrugController],
      providers: [
        {
          provide: CompanyDrugService,
          useValue: mockCompanyDrugService,
        },
      ],
    }).compile();

    controller = module.get<CompanyDrugController>(CompanyDrugController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company-drug', () => {
    const createCompanyDrugDto: CreateCompanyDrugDto = {
      drugId: 1,
      brandOwnerId: 1,
      IRC: '1234567890',
      brandNameEn: 'Test Brand',
      status: 'Test Status',
      supplierId: 1,
      producerId: 1,
    };
    controller.create(createCompanyDrugDto);
    expect(mockCompanyDrugService.create).toHaveBeenCalledWith(
      createCompanyDrugDto,
    );
  });

  it('should find all company-drugs', () => {
    controller.findAll(1, 10, 'id', 'asc');
    expect(mockCompanyDrugService.findAll).toHaveBeenCalledWith(
      1,
      10,
      'id',
      'asc',
    );
  });

  it('should find one company-drug', () => {
    const id = 1;
    controller.findOne(id);
    expect(mockCompanyDrugService.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a company-drug', () => {
    const id = 1;
    const updateCompanyDrugDto: UpdateCompanyDrugDto = {
      brandNameEn: 'Updated Brand',
    };
    controller.update(id, updateCompanyDrugDto);
    expect(mockCompanyDrugService.update).toHaveBeenCalledWith(
      id,
      updateCompanyDrugDto,
    );
  });

  it('should remove a company-drug', () => {
    const id = 1;
    controller.remove(id);
    expect(mockCompanyDrugService.remove).toHaveBeenCalledWith(id);
  });
});