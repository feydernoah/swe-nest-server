import { Controller, Get, Query, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { BikeReadService } from '../service/bike-read.service.js';
import { getLogger } from '../../logger/logger.js';

/**
 * REST-Controller für Lesezugriffe auf Bike-Ressourcen.
 * Bietet Endpunkte zur Abfrage von Bikes, gefilterten Bikes und Bike-Bildern.
 */
@Controller() // Basis-Route ist leer, damit beide Endpunkte unabhängig sind
export class BikeGetController {
  private bikeReadService: BikeReadService;
  private readonly logger = getLogger(BikeGetController.name);

  /**
   * Konstruktor mit Injektion des Read-Services.
   * 
   * @param bikeReadService - Service zum Lesen von Bike-Daten
   */
  constructor(bikeReadService: BikeReadService) {
    this.bikeReadService = bikeReadService;
  }

  /**
   * GET-Endpunkt: `/bike`
   * Gibt alle Bikes als JSON-String zurück.
   * 
   * @returns JSON-String mit allen Bikes
   */
  @Get('bike')
  async findAll(): Promise<string> {
    const bikes = await this.bikeReadService.findAll();
    this.logger.debug(`findAll: ${bikes.length} bikes returned`);
    return JSON.stringify(bikes);
  }

  /**
   * GET-Endpunkt: `/bike/:id`
   * Gibt ein einzelnes Bike anhand der ID zurück.
   * 
   * @param id - ID des Bikes als Pfadparameter
   * @returns JSON-String mit dem Bike oder Fehlermeldung
   */
  @Get('bike/:id')
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

  /**
   * GET-Endpunkt: `/bikewithtitles`
   * Gibt Bikes mit optionaler Filterung nach Marke und Typ zurück.
   * 
   * @param brand - optionale Filterung nach Marke
   * @param type - optionale Filterung nach Typ
   * @returns JSON-String mit gefilterten Bikes
   */
  @Get('bikewithtitles')
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

  /**
   * GET-Endpunkt: `/file`
   * Gibt das Bild eines Bikes als binäre Antwort zurück.
   * 
   * @param bikeId - ID des Bikes als Query-Parameter
   * @param res - Express-Response-Objekt zur direkten Antwortmanipulation
   * @returns HTTP-Response mit dem Bild oder Fehlermeldung
   */
  @Get('file')
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
