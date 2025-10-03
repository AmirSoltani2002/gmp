import { Test, TestingModule } from '@nestjs/testing';
import { MachineTypeService } from './machine-type.service';

describe('MachineTypeService', () => {
  let service: MachineTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineTypeService],
    }).compile();

    service = module.get<MachineTypeService>(MachineTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
