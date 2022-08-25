import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CarService } from '../services/car.service';

@Controller('car')
@ApiTags('car')
export class CarController {
  @Inject(CarService)
  private readonly service: CarService;

  @Get()
  public getAllCar(): Promise<Car[]> {
    return this.service.getAllCar();
  }

  @Get(':id')
  public getCar(@Param('id') id: string): Promise<Car> {
    return this.service.getCar(id);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file.buffer);
  }

  @Post()
  @ApiCreatedResponse({ type: Car })
  public createCar(@Body() body: CreateCarDTO): Promise<Car> {
    return this.service.createCar(body);
  }
}
