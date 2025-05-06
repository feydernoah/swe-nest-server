import { Injectable } from '@nestjs/common';

@Injectable()
export class BikeReadService {
  findAll(): string {
    return 'This service returns all bikes';
  }
}