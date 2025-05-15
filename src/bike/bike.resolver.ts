import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { BikeReadService } from './service/bike-read.service.js';
import { Bike } from './entity/bike.entity.js';
import { Injectable } from '@nestjs/common';

@Injectable()
@Resolver(() => Bike)
export class BikeResolver {
  private readonly bikeReadService: BikeReadService;

  constructor(bikeReadService: BikeReadService) {
    this.bikeReadService = bikeReadService;
  }

  @Query(() => Bike, { name: 'bike', nullable: true })
  async bike(@Args('id', { type: () => Int }) id: number): Promise<Bike | undefined> {
    return this.bikeReadService.findOneById(id);
  }

  @Query(() => [Bike], { name: 'bikes', nullable: true })
  async bikes(
    @Args('suchkriterien', { nullable: true }) suchkriterien?: any
  ): Promise<Bike[]> {
    if (suchkriterien) {
      return this.bikeReadService.findAllWithFilters(suchkriterien);
    }
    return this.bikeReadService.findAll();
  }
}
