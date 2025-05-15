import { Controller, Get, Query, Param } from '@nestjs/common';
import { BikeReadService } from '../service/bike-read.service.js';
import { getLogger } from '../../logger/logger.js';

@Controller() // Basis-Route ist leer, damit beide Endpunkte unabhängig sind
export class BikeGetController {
  private bikeReadService: BikeReadService;
  private readonly logger = getLogger(BikeGetController.name);

  constructor(bikeReadService: BikeReadService) {
    this.bikeReadService = bikeReadService;
  }

  @Get('bike') // Endpunkt: /bike
  async findAll(): Promise<string> {
    const bikes = await this.bikeReadService.findAll();
    this.logger.debug(`findAll: ${bikes.length} bikes returned`);
    return JSON.stringify(bikes);
  }

  @Get('bike/:id') // Endpunkt: /bike/:id
  async findOne(@Param('id') id: string): Promise<string> {
    const bike = await this.bikeReadService.findOneById(Number(id));
    if (bike) {
      this.logger.debug(`findOne: Bike found for id=${id}`);
      return JSON.stringify(bike);
    } else {
      this.logger.debug(`findOne: No bike found for id=${id}`);
      return JSON.stringify({ error: 'Bike not found' });
    }
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
    this.logger.debug(`findAllWithTitles: ${bikesWithTitles.length} bikes returned with filters brand=${brand}, type=${type}`);
    return JSON.stringify(bikesWithTitles);
  }
}