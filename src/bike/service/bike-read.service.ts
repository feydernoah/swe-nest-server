import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';
import { BikeImage } from '../entity/bike-image.entity.js';
import { getLogger } from '../../logger/logger.js';

/**
 * Service für Leseoperationen auf Bike-Daten aus der Datenbank.
 */
@Injectable()
export class BikeReadService {
  private bikeRepository: Repository<Bike>;
  private readonly logger = getLogger(BikeReadService.name);

  /**
   * Konstruktor mit Injektion des Bike-Repositorys.
   * 
   * @param bikeRepository - Repository für Bike-Entitäten
   */
  constructor(@InjectRepository(Bike) bikeRepository: Repository<Bike>) {
    this.bikeRepository = bikeRepository;
  }

  /**
   * Findet alle Bikes ohne zusätzliche Relationen.
   * 
   * @returns Liste aller Bikes in der Datenbank
   */
  async findAll(): Promise<Bike[]> {
    const bikes = await this.bikeRepository.find();
    this.logger.debug(`findAll: ${bikes.length} bikes found`);
    return bikes;
  }

  /**
   * Findet alle Bikes inklusive ihrer zugehörigen Titel-Relation.
   * 
   * @returns Liste aller Bikes mit geladenem `title`
   */
  async findAllWithTitles(): Promise<Bike[]> {
    const bikes = await this.bikeRepository.find({ relations: ['title'] });
    this.logger.debug(`findAllWithTitles: ${bikes.length} bikes found`);
    return bikes;
  }

  /**
   * Findet alle Bikes basierend auf optionalen Filterkriterien `brand` und `type`.
   *
   * @param filters - Filterobjekt mit optionaler Marke und Typ
   * @returns Liste gefilterter Bikes mit geladener Titel-Relation
   */
  async findAllWithFilters(filters: { brand?: string; type?: string }): Promise<Bike[]> {
    const queryBuilder = this.bikeRepository
      .createQueryBuilder('bike')
      .leftJoinAndSelect('bike.title', 'title');

    if (filters.brand) {
      queryBuilder.andWhere('bike.brand = :brand', { brand: filters.brand });
    }

    if (filters.type) {
      queryBuilder.andWhere('bike.type = :type', { type: filters.type });
    }

    const bikes = await queryBuilder.getMany();
    this.logger.debug(
      `findAllWithFilters: ${bikes.length} bikes found with filters ${JSON.stringify(filters)}`,
    );
    return bikes;
  }

  /**
   * Findet ein einzelnes Bike anhand seiner ID.
   *
   * @param id - ID des Bikes
   * @returns Gefundenes Bike oder `undefined`, wenn nicht vorhanden
   */
  async findOneById(id: number): Promise<Bike | undefined> {
    const result = await this.bikeRepository.findOne({ where: { id } });
    if (result === null || result === undefined) {
      this.logger.debug(`findOneById: No bike found for id=${id}`);
      return undefined;
    }
    this.logger.debug(`findOneById: Bike found for id=${id}`);
    return result;
  }

  /**
   * Holt das Bild eines Bikes über dessen ID.
   *
   * @param bikeId - ID des Bikes, zu dem das Bild gehört
   * @returns Gefundenes `BikeImage` oder `undefined`, wenn nicht vorhanden
   */
  async getImageByBikeId(bikeId: number): Promise<BikeImage | undefined> {
    const image = await this.bikeRepository.manager
      .getRepository(BikeImage)
      .findOne({ where: { bikeId } });

    return image === null ? undefined : image;
  }
}
