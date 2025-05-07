import { Controller, Get } from '@nestjs/common';
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
  async findAllWithTitles(): Promise<string> {
    const bikesWithTitles = await this.bikeReadService.findAllWithTitles();
    return JSON.stringify(bikesWithTitles);
  }
}