import { Test, TestingModule } from '@nestjs/testing';
import { Request126Controller } from './request126.controller';

describe('Request126Controller', () => {
  let controller: Request126Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Request126Controller],
    }).compile();

    controller = module.get<Request126Controller>(Request126Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
