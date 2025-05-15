import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';
import { MailService } from '../../mail/mail.service.js';
import { getLogger } from '../../logger/logger.js';

@Injectable()
export class BikeWriteService {
  bikeRepository: Repository<Bike>;
  private mailService: MailService;
  private readonly logger = getLogger(BikeWriteService.name);

  constructor(
    @InjectRepository(Bike) bikeRepository: Repository<Bike>,
    mailService: MailService,
  ) {
    this.bikeRepository = bikeRepository;
    this.mailService = mailService;
  }

  async createBike(bikeData: Partial<Bike>): Promise<Bike> {
    const newBike = this.bikeRepository.create(bikeData);
    const savedBike = await this.bikeRepository.save(newBike);
    this.logger.debug(`createBike: Bike created with id=${savedBike.id}`);
    // Send email notification
    const subject = 'Neue Fahrradverfügbarkeit';
    const body = `Ein neues Fahrrad ist verfügbar:\nMarke: ${savedBike.brand}\n-Typ: ${savedBike.type}\n-Rahmengröße: ${savedBike.frameSize}\nfür nur: ${savedBike.price}€ !!!!`;
    await this.mailService.sendmail({ subject, body });
    return savedBike;
  }

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
}