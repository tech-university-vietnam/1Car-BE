import { CarSize } from './models/carSize.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './controllers/car.controller';
import { Car } from './models/car.entity';
import { CarType } from './models/carType.entity';
import { CarService } from './services/car.service';
import { CarBrand } from './models/carBrand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([CarType]),
    TypeOrmModule.forFeature([CarSize]),
    TypeOrmModule.forFeature([CarBrand]),
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
