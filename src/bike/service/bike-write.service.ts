import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from '../entity/bike.entity.js';
import { MailService } from '../../mail/mail.service.js';

@Injectable()
export class BikeWriteService {
  bikeRepository: Repository<Bike>;
  private mailService: MailService;

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

    // Send email notification
    const subject = 'Neue Fahrradverfügbarkeit';
    const body = `Ein neues Fahrrad ist verfügbar:
Marke: ${savedBike.brand}
-Typ: ${savedBike.type}
-Rahmengröße: ${savedBike.frameSize}
für nur: ${savedBike.price}€ !!!!`;
    await this.mailService.sendmail({ subject, body });

    return savedBike;
  }
}