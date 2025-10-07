import { Test, TestingModule } from '@nestjs/testing';
import { DosageController } from './dosage.controller';
import { DosageService } from './dosage.service';
import { DatabaseService } from 'src/database/database.service';

describe('DosageController', () => {
  let controller: DosageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DosageController],
      providers: [
        DosageService,
        {
          provide: DatabaseService,
          useValue: {
            // Mock the methods you use from DatabaseService
          },
        },
      ],
    }).compile();

    controller = module.get<DosageController>(DosageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
