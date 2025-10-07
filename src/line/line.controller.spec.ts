import { Test, TestingModule } from '@nestjs/testing';
import { LineController } from './line.controller';
import { LineService } from './line.service';
import { DatabaseService } from 'src/database/database.service';
import { SiteService } from 'src/site/site.service';

describe('LineController', () => {
  let controller: LineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineController],
      providers: [
        LineService,
        {
          provide: DatabaseService,
          useValue: {},
        },
        {
          provide: SiteService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LineController>(LineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
