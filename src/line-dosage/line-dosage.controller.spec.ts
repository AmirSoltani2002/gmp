import { Test, TestingModule } from '@nestjs/testing';
import { LineDosageController } from './line-dosage.controller';
import { LineDosageService } from './line-dosage.service';
import { DatabaseService } from 'src/database/database.service';
import { LineService } from 'src/line/line.service';
import { DosageService } from 'src/dosage/dosage.service';

describe('LineDosageController', () => {
  let controller: LineDosageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineDosageController],
      providers: [
        LineDosageService,
        {
          provide: DatabaseService,
          useValue: {},
        },
        {
          provide: LineService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DosageService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LineDosageController>(LineDosageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
