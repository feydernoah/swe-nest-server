import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity/entities.js';
import { BikeGetController } from './controller/bike-get.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [BikeGetController], // Controller registrieren
})
export class BikeModule {}