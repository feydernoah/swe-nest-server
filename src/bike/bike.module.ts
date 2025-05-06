import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity/entities.js';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
})
export class BikeModule {}