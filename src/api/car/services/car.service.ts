import { CarType } from './../models/carType.entity';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarStatus } from '../../../contains';
import { Repository } from 'typeorm';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CarSize } from '../models/carSize.entity';
import { CarBrand } from '../models/carBrand.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';

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

    return data;
  }

  public async uploadImage(file: Buffer) {
    try {
      const form = new FormData();

      form.append('image', file, {
        filename: 'image.png',
      });

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.UPLOAD_API_KEY}`,
        form,
      );

      return response.data;
    } catch (err) {
      throw new BadGatewayException('Upload to imgbb failed');
    }
  }
}
