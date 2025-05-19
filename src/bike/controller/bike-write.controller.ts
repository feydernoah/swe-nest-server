import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BikeWriteService } from '../service/bike-write.service.js';
import { Bike } from '../entity/bike.entity.js';
import { BikeImage } from '../entity/bike-image.entity.js';
import { Response } from 'express';

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
   * @returns Das neu erstellte Bike-Objekt
   */
  @Post()
  async writeBike(@Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.createBike(bikeData);
  }

  /**
   * PUT-Endpunkt: `/bike/:id`
   * Aktualisiert ein vorhandenes Bike vollständig mit den übergebenen Daten.
   *
   * @param id - ID des zu aktualisierenden Bikes
   * @param bikeData - Neue Daten für das Bike
   * @returns Das aktualisierte Bike-Objekt
   */
  @Put(':id')
  async updateBike(@Param('id') id: number, @Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.updateBike(id, bikeData);
  }

  /**
   * PATCH-Endpunkt: `/bike/:id/price`
   * Aktualisiert nur den Preis eines Bikes.
   *
   * @param id - ID des Bikes
   * @param price - Neuer Preiswert
   * @returns Das aktualisierte Bike mit neuem Preis
   */
  @Patch(':id/price')
  async updateBikePrice(@Param('id') id: number, @Body('price') price: number): Promise<Bike> {
    return this.bikeCreateService.updateBikePrice(id, price);
  }

  /**
   * POST-Endpunkt: `/bike/image`
   * Lädt ein Bild zu einem Bike hoch und speichert es.
   *
   * @param bikeId - ID des zugehörigen Bikes
   * @param description - Beschreibung des Bildes
   * @param contentType - MIME-Typ des Bildes (z. B. image/png)
   * @param file - Bilddatei als hochgeladenes Multer-File
   * @returns Das gespeicherte BikeImage-Objekt
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBikeImage(
    @Body('bikeId') bikeId: number,
    @Body('description') description: string,
    @Body('contentType') contentType: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BikeImage> {
    return this.bikeCreateService.insertBikeImage(
      bikeId,
      description,
      contentType,
      file.buffer,
    );
  }

  /**
   * GET-Endpunkt: `/bike/image`
   * Gibt ein Bike-Bild anhand der Bike-ID als HTTP-Response zurück.
   *
   * @param bikeId - ID des Bikes als Query-Parameter
   * @param res - Express-Response-Objekt zur direkten Datenrückgabe
   * @returns HTTP-Response mit Bilddaten oder Fehlermeldung
   */
  @Get('image')
  async getBikeImageByBikeId(
    @Query('bikeId') bikeId: string,
    @Res() res: Response,
  ) {
    const id = Number(bikeId);
    if (isNaN(id)) {
      return res.status(400).send('Invalid bikeId');
    }
    const image = await this.bikeCreateService.getImageByBikeId(id);
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    res.setHeader('Content-Type', image.contentType || 'application/octet-stream');
    res.send(image.data);
    return;
  }
}
