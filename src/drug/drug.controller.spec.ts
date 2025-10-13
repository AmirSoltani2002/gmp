import { Test, TestingModule } from '@nestjs/testing';
import { DrugController } from './drug.controller';
import { DrugService } from './drug.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

const mockDrugService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('DrugController', () => {
  let controller: DrugController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugController],
      providers: [
        {
          provide: DrugService,
          useValue: mockDrugService,
        },
      ],
    }).compile();

    controller = module.get<DrugController>(DrugController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a drug', () => {
    const createDrugDto: CreateDrugDto = {
      drugIndexName: 'Test Drug',
      genericName: 'Test Generic',
      genericCode: 'T123',
      ATC: 'A12B',
    };
    controller.create(createDrugDto);
    expect(mockDrugService.create).toHaveBeenCalledWith(createDrugDto);
  });

  it('should find all drugs', () => {
    controller.findAll(1, 10, 'id', 'asc', {});
    expect(mockDrugService.findAll).toHaveBeenCalledWith(1, 10, 'id', 'asc', {});
  });

  it('should find one drug', () => {
    const id = 1;
    controller.findOne(id);
    expect(mockDrugService.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a drug', () => {
    const id = 1;
    const updateDrugDto: UpdateDrugDto = {
      drugIndexName: 'Updated Drug',
    };
    controller.update(id, updateDrugDto);
    expect(mockDrugService.update).toHaveBeenCalledWith(id, updateDrugDto);
  });

  it('should remove a drug', () => {
    const id = 1;
    controller.remove(id);
    expect(mockDrugService.remove).toHaveBeenCalledWith(id);
  });
});
