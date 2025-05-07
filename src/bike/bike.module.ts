import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity/entities.js';
import { BikeGetController } from './controller/bike-get.controller.js';
import { BikeReadService } from './service/bike-read.service.js';
import { BikeWriteController } from './controller/bike-write.controller.js';
import { BikeWriteService } from './service/bike-write.service.js';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [BikeGetController, BikeWriteController],
    providers: [BikeReadService, BikeWriteService],
})
export class BikeModule {}