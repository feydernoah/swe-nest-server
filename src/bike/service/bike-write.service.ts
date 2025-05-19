import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';
import { BikeImage } from '../entity/bike-image.entity.js';
import { MailService } from '../../mail/mail.service.js';
import { getLogger } from '../../logger/logger.js';

/**
 * Service-Klasse für Schreiboperationen auf Bikes und deren Bildern.
 * Verantwortlich für das Erstellen, Aktualisieren und Speichern von Fahrraddaten
 * sowie das Versenden von Benachrichtigungs-E-Mails.
 */
@Injectable()
export class BikeWriteService {
  bikeRepository: Repository<Bike>;
  private bikeImageRepository: Repository<BikeImage>;
  private mailService: MailService;
  private readonly logger = getLogger(BikeWriteService.name);

  /**
   * Konstruktor mit Abhängigkeiten für Repositories und Mail-Service.
   * 
   * @param bikeRepository - Repository für die `Bike`-Entität
   * @param bikeImageRepository - Repository für die `BikeImage`-Entität
   * @param mailService - Service zum Versenden von E-Mails
   */
  constructor(
    @InjectRepository(Bike) bikeRepository: Repository<Bike>,
    @InjectRepository(BikeImage) bikeImageRepository: Repository<BikeImage>,
    mailService: MailService,
  ) {
    this.bikeRepository = bikeRepository;
    this.bikeImageRepository = bikeImageRepository;
    this.mailService = mailService;
  }

  /**
   * Erstellt ein neues Bike und speichert es in der Datenbank.
   * Zusätzlich wird eine Benachrichtigungs-E-Mail versendet.
   *
   * @param bikeData - Teilobjekt mit Bike-Daten
   * @returns Das gespeicherte Bike
   */
  async createBike(bikeData: Partial<Bike>): Promise<Bike> {
    const newBike = this.bikeRepository.create(bikeData);
    const savedBike = await this.bikeRepository.save(newBike);
    this.logger.debug(`createBike: Bike created with id=${savedBike.id}`);

    // Benachrichtigungs-Mail senden
    const subject = 'Neue Fahrradverfügbarkeit';
    const body = `Ein neues Fahrrad ist verfügbar:\nMarke: ${savedBike.brand}\n-Typ: ${savedBike.type}\n-Rahmengröße: ${savedBike.frameSize}\nfür nur: ${savedBike.price}€ !!!!`;
    await this.mailService.sendmail({ subject, body });

    return savedBike;
  }

  /**
   * Aktualisiert ein bestehendes Bike anhand seiner ID.
   *
   * @param id - Die ID des zu aktualisierenden Bikes
   * @param bikeData - Neue Werte für das Bike
   * @returns Das aktualisierte Bike
   * @throws Error, wenn das Bike nicht gefunden wird
   */
  async updateBike(id: number, bikeData: Partial<Bike>): Promise<Bike> {
    const bike = await this.bikeRepository.findOne({ where: { id } });
    if (!bike) {
      this.logger.debug(`updateBike: No bike found for id=${id}`);
      throw new Error(`Bike with ID ${id} not found`);
    }
    Object.assign(bike, bikeData);
    const updatedBike = await this.bikeRepository.save(bike);
    this.logger.debug(`updateBike: Bike updated for id=${id}`);
    return updatedBike;
  }

  /**
   * Aktualisiert nur den Preis eines Bikes.
   *
   * @param id - Die ID des Bikes
   * @param price - Neuer Preis
   * @returns Das aktualisierte Bike mit geändertem Preis
   * @throws Error, wenn das Bike nicht gefunden wird
   */
  async updateBikePrice(id: number, price: number): Promise<Bike> {
    const bike = await this.bikeRepository.findOne({ where: { id } });
    if (!bike) {
      this.logger.debug(`updateBikePrice: No bike found for id=${id}`);
      throw new Error(`Bike with ID ${id} not found`);
    }
    bike.price = price;
    const updatedBike = await this.bikeRepository.save(bike);
    this.logger.debug(`updateBikePrice: Price updated for bike id=${id}`);
    return updatedBike;
  }

  /**
   * Fügt ein Bild für ein Bike in die Datenbank ein.
   *
   * @param bikeId - Die ID des zugehörigen Bikes
   * @param description - Beschreibung des Bildes
   * @param contentType - MIME-Type des Bildes (z. B. image/jpeg)
   * @param data - Bilddaten als Buffer
   * @returns Das gespeicherte `BikeImage`-Objekt
   */
  async insertBikeImage(
    bikeId: number,
    description: string,
    contentType: string,
    data: Buffer,
  ): Promise<BikeImage> {
    const bikeImage = this.bikeImageRepository.create({
      bikeId,
      description,
      contentType,
      data,
    });
    return this.bikeImageRepository.save(bikeImage);
  }

  /**
   * Ruft ein Bild zu einem bestimmten Bike anhand der Bike-ID ab.
   *
   * @param bikeId - Die ID des Bikes
   * @returns Gefundenes `BikeImage`-Objekt oder `undefined`, wenn nicht vorhanden
   */
  async getImageByBikeId(bikeId: number): Promise<BikeImage | undefined> {
    const image = await this.bikeImageRepository.findOne({ where: { bikeId } });
    return image === null ? undefined : image;
  }
}
