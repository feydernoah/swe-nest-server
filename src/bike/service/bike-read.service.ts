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
}