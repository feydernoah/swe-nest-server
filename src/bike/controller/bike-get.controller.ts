import { Controller, Get } from '@nestjs/common';

@Controller('bike')
export class BikeGetController {
  @Get()
  findAll(): string {
    return 'This action returns all bikes';
  }
}