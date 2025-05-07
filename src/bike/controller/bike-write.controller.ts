import { Controller, Post, Body } from '@nestjs/common';
import { BikeWriteService } from '../service/bike-write.service.js';
import { Bike } from '../entity/bike.entity.js';

@Controller('bike')
export class BikeWriteController {
  bikeCreateService: BikeWriteService;

  constructor(bikeCreateService: BikeWriteService) {
    this.bikeCreateService = bikeCreateService;
  }

  @Post()
  async writeBike(@Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.createBike(bikeData);
  }
}