import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';

@Injectable()
export class BikeWriteService {
  bikeRepository: Repository<Bike>;

  constructor(
    @InjectRepository(Bike) bikeRepository: Repository<Bike>,
  ) {
    this.bikeRepository = bikeRepository;
  }

  async createBike(bikeData: Partial<Bike>): Promise<Bike> {
    const newBike = this.bikeRepository.create(bikeData);
    return this.bikeRepository.save(newBike);
  }
}