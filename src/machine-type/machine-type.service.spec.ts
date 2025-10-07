import { Test, TestingModule } from '@nestjs/testing';
import { MachineTypeService } from './machine-type.service';
import { DatabaseService } from 'src/database/database.service';

describe('MachineTypeService', () => {
  let service: MachineTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachineTypeService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    service = module.get<MachineTypeService>(MachineTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
