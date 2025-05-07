import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity/entities.js';
import { BikeGetController } from './controller/bike-get.controller.js';
import { BikeReadService } from './service/bike-read.service.js';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [BikeGetController],
    providers: [BikeReadService], // Register BikeReadService as a provider
})
export class BikeModule {}