import { CarType } from './../models/carType.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarStatus } from '../../../contains';
import { Repository } from 'typeorm';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CarSize } from '../models/carSize.entity';
import { CarBrand } from '../models/carBrand.entity';

@Injectable()
export class CarService {
  @InjectRepository(Car)
  private readonly carRepository: Repository<Car>;

  @InjectRepository(CarType)
  private readonly carTypeRepository: Repository<CarType>;

  @InjectRepository(CarSize)
  private readonly carSizeRepository: Repository<CarSize>;

  @InjectRepository(CarBrand)
  private readonly carBrandRepository: Repository<CarBrand>;

  // constructor() {}

  public async initData() {
    await this.carBrandRepository.delete({});
    await this.carSizeRepository.delete({});
    await this.carTypeRepository.delete({});
    await this.carRepository.delete({});

    const brand = await this.carBrandRepository.save({
      name: 'Audi',
    });

    const size = await this.carSizeRepository.save({
      name: '6 seats',
    });

    const type = await this.carTypeRepository.save({
      name: 'SUV',
    });

    const newCar = await this.carRepository.save({
      name: 'New Car 1',
      description: 'New car',
      carType: type,
      carSize: size,
      carBrand: brand,
      pricePerDate: 100,
      images: ['images1.png'],
      status: CarStatus.AVAILABLE,
    });

    console.log('Init car mock data success.');
  }

  public getCar(id: string): Promise<Car> {
    return this.carRepository.findOneBy({ id: id });
  }

  public createCar(body: CreateCarDTO): Promise<Car> {
    const car: Car = new Car();

    return this.carRepository.save(car);
  }

  public async getAllCar(): Promise<Car[]> {
    const data = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carBrand', 'car_brand')
      .leftJoinAndSelect('car.carType', 'car_type')
      .leftJoinAndSelect('car.carSize', 'car_size')
      .getMany();

    console.log(data);
    return data;
  }
}
