import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CarService } from '../services/car.service';

@Controller('car')
@ApiTags('car')
export class CarController {
  @Inject(CarService)
  private readonly service: CarService;

  @Get(':id')
  public getCar(@Param('id') id: string): Promise<Car> {
    return this.service.getCar(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Car })
  public createCar(@Body() body: CreateCarDTO): Promise<Car> {
    return this.service.createCar(body);
  }
}
