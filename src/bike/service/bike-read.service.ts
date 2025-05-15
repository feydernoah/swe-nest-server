import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';

@Injectable()
export class BikeReadService {
  private bikeRepository: Repository<Bike>;

  constructor(@InjectRepository(Bike) bikeRepository: Repository<Bike>) {
    this.bikeRepository = bikeRepository;
  }

  async findAll(): Promise<Bike[]> {
    return this.bikeRepository.find();
  }

  async findAllWithTitles(): Promise<Bike[]> {
    return this.bikeRepository.find({ relations: ['title'] });
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

    return queryBuilder.getMany();
  }

  async findOneById(id: number): Promise<Bike | undefined> {
    const result = await this.bikeRepository.findOne({ where: { id } });
    return result === null ? undefined : result;
  }
}