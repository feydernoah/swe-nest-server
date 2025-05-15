import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';
import { getLogger } from '../../logger/logger.js';

@Injectable()
export class BikeReadService {
  private bikeRepository: Repository<Bike>;
  private readonly logger = getLogger(BikeReadService.name);

  constructor(@InjectRepository(Bike) bikeRepository: Repository<Bike>) {
    this.bikeRepository = bikeRepository;
  }

  async findAll(): Promise<Bike[]> {
    const bikes = await this.bikeRepository.find();
    this.logger.debug(`findAll: ${bikes.length} bikes found`);
    return bikes;
  }

  async findAllWithTitles(): Promise<Bike[]> {
    const bikes = await this.bikeRepository.find({ relations: ['title'] });
    this.logger.debug(`findAllWithTitles: ${bikes.length} bikes found`);
    return bikes;
  }

  async findAllWithFilters(filters: { brand?: string; type?: string }): Promise<Bike[]> {
    const queryBuilder = this.bikeRepository.createQueryBuilder('bike')
      .leftJoinAndSelect('bike.title', 'title');

    if (filters.brand) {
      queryBuilder.andWhere('bike.brand = :brand', { brand: filters.brand });
    }

    if (filters.type) {
      queryBuilder.andWhere('bike.type = :type', { type: filters.type });
    }

    const bikes = await queryBuilder.getMany();
    this.logger.debug(`findAllWithFilters: ${bikes.length} bikes found with filters ${JSON.stringify(filters)}`);
    return bikes;
  }

  async findOneById(id: number): Promise<Bike | undefined> {
    const result = await this.bikeRepository.findOne({ where: { id } });
    if (result === null || result === undefined) {
      this.logger.debug(`findOneById: No bike found for id=${id}`);
      return undefined;
    }
    this.logger.debug(`findOneById: Bike found for id=${id}`);
    return result;
  }
}