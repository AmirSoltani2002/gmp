import { Test, TestingModule } from '@nestjs/testing';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { DatabaseService } from 'src/database/database.service';
import { MachineTypeService } from 'src/machine-type/machine-type.service';
import { SiteService } from 'src/site/site.service';
import { LineService } from 'src/line/line.service';

describe('MachineController', () => {
  let controller: MachineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineController],
      providers: [
        MachineService,
        {
          provide: DatabaseService,
          useValue: {},
        },
        {
          provide: MachineTypeService,
          useValue: {},
        },
        {
          provide: SiteService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: LineService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MachineController>(MachineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
