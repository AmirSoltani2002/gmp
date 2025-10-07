import { Test, TestingModule } from '@nestjs/testing';
import { CompanyPersonController } from './company-person.controller';
import { CompanyPersonService } from './company-person.service';
import { DatabaseService } from 'src/database/database.service';

describe('CompanyPersonController', () => {
  let controller: CompanyPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyPersonController],
      providers: [
        CompanyPersonService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyPersonController>(CompanyPersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
