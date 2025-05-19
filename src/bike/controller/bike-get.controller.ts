import { Controller, Get, Query, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
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
    const numId = Number(id);
    if (isNaN(numId)) {
      this.logger.debug(`findOne: Invalid id=${id}`);
      throw new NotFoundException('Invalid id');
    }
    const bike = await this.bikeReadService.findOneById(numId);
    if (bike) {
      this.logger.debug(`findOne: Bike found for id=${id}`);
      return JSON.stringify(bike);
    } else {
      this.logger.debug(`findOne: No bike found for id=${id}`);
      throw new NotFoundException('Bike not found');
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
    if (!bikesWithTitles || bikesWithTitles.length === 0) {
      this.logger.debug(`findAllWithTitles: No bikes found with filters brand=${brand}, type=${type}`);
      throw new NotFoundException('No bikes found with the given filters');
    }
    this.logger.debug(`findAllWithTitles: ${bikesWithTitles.length} bikes returned with filters brand=${brand}, type=${type}`);
    return JSON.stringify(bikesWithTitles);
  }

  @Get('bikeimage') // Endpunkt: /bikeimage
  async getBikeImageByBikeId(
    @Query('bikeId') bikeId: string,
    @Res() res: Response,
  ) {
    const id = Number(bikeId);
    if (isNaN(id)) {
      return res.status(400).send('Invalid bikeId');
    }
    const image = await this.bikeReadService.getImageByBikeId(id);
    if (!image || !image.data) {
      // Rückgabe als Exception für konsistentes Fehlerhandling
      throw new NotFoundException('Image not found');
    }
    res.setHeader('Content-Type', image.contentType || 'application/octet-stream');
    res.send(image.data);
    return;
  }
}