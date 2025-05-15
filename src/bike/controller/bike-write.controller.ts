import { Controller, Post, Body, Put, Param, Patch, UploadedFile, UseInterceptors, Get, Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BikeWriteService } from '../service/bike-write.service.js';
import { Bike } from '../entity/bike.entity.js';
import { BikeImage } from '../entity/bike-image.entity.js';
import { Response } from 'express';

@Controller('bike')
export class BikeWriteController {
  bikeCreateService: BikeWriteService;

  constructor(bikeCreateService: BikeWriteService) {
    this.bikeCreateService = bikeCreateService;
  }

  @Post()
  async writeBike(@Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.createBike(bikeData);
  }

  @Put(':id')
  async updateBike(@Param('id') id: number, @Body() bikeData: Partial<Bike>): Promise<Bike> {
    return this.bikeCreateService.updateBike(id, bikeData);
  }

  @Patch(':id/price')
  async updateBikePrice(@Param('id') id: number, @Body('price') price: number): Promise<Bike> {
    return this.bikeCreateService.updateBikePrice(id, price);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBikeImage(
    @Body('bikeId') bikeId: number,
    @Body('description') description: string,
    @Body('contentType') contentType: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BikeImage> {
    return this.bikeCreateService.insertBikeImage(
      bikeId,
      description,
      contentType,
      file.buffer,
    );
  }

  @Get('image')
  async getBikeImageByBikeId(
    @Query('bikeId') bikeId: string,
    @Res() res: Response,
  ) {
    const id = Number(bikeId);
    if (isNaN(id)) {
      return res.status(400).send('Invalid bikeId');
    }
    const image = await this.bikeCreateService.getImageByBikeId(id);
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    res.setHeader('Content-Type', image.contentType || 'application/octet-stream');
    res.send(image.data);
    return;
  }
}