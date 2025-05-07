import { Controller, Post, Body, Put, Param, Patch } from '@nestjs/common';
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

  @Put(':id')
  async updateBike(@Param('id') id: number, @Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.updateBike(id, bikeData);
  }

  @Patch(':id/price')
  async updateBikePrice(@Param('id') id: number, @Body('price') price: number): Promise<Bike> {
    return this.bikeCreateService.updateBikePrice(id, price);
  }
}