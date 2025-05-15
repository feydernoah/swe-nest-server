import { Test, TestingModule } from '@nestjs/testing';
import { BikeGetController } from '../../src/bike/controller/bike-get.controller.js';
import { BikeReadService } from '../../src/bike/service/bike-read.service.js';

describe('BikeGetController', () => {
  let controller: BikeGetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeGetController],
      providers: [
        {
          provide: BikeReadService,
          useValue: {
            findAll: jest.fn().mockResolvedValue('This action returns all bikes'),
            findAllWithFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BikeGetController>(BikeGetController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('should return all bikes', async () => {
    await expect(controller.findAll()).resolves.toBe('"This action returns all bikes"');
  });
});