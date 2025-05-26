import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { BikeWriteService } from '../service/bike-write.service.js';
import { Bike } from '../entity/bike.entity.js';

/**
 * REST-Controller für Schreiboperationen auf Bike-Ressourcen.
 * Unterstützt Erstellen, Aktualisieren und Hochladen von Bike-Daten und -Bildern.
 */
@Controller('bike')
export class BikeWriteController {
  bikeCreateService: BikeWriteService;

  /**
   * Konstruktor mit Injektion des Schreibservices.
   * 
   * @param bikeCreateService - Service für Schreiboperationen an Bike-Daten
   */
  constructor(bikeCreateService: BikeWriteService) {
    this.bikeCreateService = bikeCreateService;
  }

  /**
   * POST-Endpunkt: `/bike`
   * Erstellt ein neues Bike auf Basis der übergebenen Daten.
   *
   * @param bikeData - Teilobjekt des Bike-DTOs
   * @returns 201-Status bei Erfolg, 400 bei Fehlern
   */
  @Post()
  async writeBike(
    @Body() bikeData: Partial<Bike>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.bikeCreateService.createBike(bikeData);
      res.status(201).send();
    } catch (error) {
      res.status(400).send();
    }
  }

  /**
   * PUT-Endpunkt: `/bike/:id`
   * Aktualisiert ein vorhandenes Bike vollständig mit den übergebenen Daten.
   *
   * @param id - ID des zu aktualisierenden Bikes
   * @param bikeData - Neue Daten für das Bike
   * @returns 201-Status bei Erfolg, 400 bei Fehlern
   */
  @Put(':id')
  async updateBike(
    @Param('id') id: number,
    @Body() bikeData: Partial<Bike>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.bikeCreateService.updateBike(id, bikeData);
      res.status(201).send();
    } catch (error) {
      res.status(400).send();
    }
  }

  /**
   * PATCH-Endpunkt: `/bike/:id/price`
   * Aktualisiert nur den Preis eines Bikes.
   *
   * @param id - ID des Bikes
   * @param price - Neuer Preiswert
   * @returns 201-Status bei Erfolg, 400 bei Fehlern
   */
  @Patch(':id/price')
  async updateBikePrice(
    @Param('id') id: number,
    @Body('price') price: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.bikeCreateService.updateBikePrice(id, price);
      res.status(201).send();
    } catch (error) {
      res.status(400).send();
    }
  }

  /**
   * POST-Endpunkt: `/bike/file`
   * Lädt ein Bild zu einem Bike hoch und speichert es.
   *
   * @param bikeId - ID des zugehörigen Bikes
   * @param description - Beschreibung des Bildes
   * @param contentType - MIME-Typ des Bildes (z. B. image/png)
   * @param file - Bilddatei als hochgeladenes Multer-File
   * @returns 201-Status bei Erfolg, 400 bei Fehlern
   */
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBikeImage(
    @Body('bikeId') bikeId: number,
    @Body('description') description: string,
    @Body('contentType') contentType: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.bikeCreateService.insertBikeImage(
        bikeId,
        description,
        contentType,
        file.buffer,
      );
      res.status(201).send();
    } catch (error) {
      res.status(400).send();
    }
  }
}
