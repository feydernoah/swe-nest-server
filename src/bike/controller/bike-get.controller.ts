import { Controller, Get, Query } from '@nestjs/common';
import { BikeReadService } from '../service/bike-read.service.js';

@Controller() // Basis-Route ist leer, damit beide Endpunkte unabhängig sind
export class BikeGetController {
  private bikeReadService: BikeReadService;

  constructor(bikeReadService: BikeReadService) {
    this.bikeReadService = bikeReadService;
  }

  @Get('bike') // Endpunkt: /bike
  async findAll(): Promise<string> {
    const bikes = await this.bikeReadService.findAll();
    return JSON.stringify(bikes);
  }

  @Get('bikewithtitles') // Endpunkt: /bikewithtitles
  async findAllWithTitles(
    @Query('brand') brand?: string,
    @Query('type') type?: string,
  ): Promise<string> {
    const bikesWithTitles = await this.bikeReadService.findAllWithFilters({
      brand,
      type,
    });
    return JSON.stringify(bikesWithTitles);
  }
}