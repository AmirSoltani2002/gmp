import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PersonService } from 'src/person/person.service';
import { FindAllCompanyDto } from './dto/find-all-company.dto';

const mockCompanyService = {
  findAll: jest.fn(),
};

const mockPersonService = {};

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call companyService.findAll with the correct query', () => {
      const query: FindAllCompanyDto = { page: 2, pageSize: 20, q: 'search' };
      controller.findAll(query);
      expect(mockCompanyService.findAll).toHaveBeenCalledWith(query);
    });

    it('should use default values if query is empty', () => {
      const query: FindAllCompanyDto = {};
      controller.findAll(query);
      expect(mockCompanyService.findAll).toHaveBeenCalledWith(query);
    });
  });
});