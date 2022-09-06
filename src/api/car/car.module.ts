import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CarController } from './controllers/car.controller';
import { Car } from './models/car.entity';
import { CarAttribute } from './models/carAttribute.entity';
import { CarService } from './services/car.service';

@Module({
  imports: [
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([CarAttribute]),
  ],
  exports: [
    CarService,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
