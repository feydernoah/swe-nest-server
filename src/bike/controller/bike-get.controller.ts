import { Controller, Get } from '@nestjs/common';
import { BikeReadService } from '../service/bike-read.service.js';

@Controller('bike')
export class BikeGetController {
  private bikeReadService: BikeReadService;

  constructor(bikeReadService: BikeReadService) {
    this.bikeReadService = bikeReadService;
  }

  @Get()
  async findAll(): Promise<string> {
    const bikes = await this.bikeReadService.findAll();
    return JSON.stringify(bikes);
  }
}