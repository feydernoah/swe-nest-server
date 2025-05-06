import { Test, TestingModule } from '@nestjs/testing';
import { BikeGetController } from '../../src/bike/controller/bike-get.controller';

describe('BikeGetController', () => {
  let controller: BikeGetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeGetController],
    }).compile();

    controller = module.get<BikeGetController>(BikeGetController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('should return all bikes', () => {
    expect(controller.findAll()).toBe('This action returns all bikes');
  });
});