import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';

@Injectable()
export class CarService {
  @InjectRepository(Car)
  private readonly repository: Repository<Car>;

  public getCar(id: string): Promise<Car> {
    return this.repository.findOneBy({ id: id });
  }

  public createCar(body: CreateCarDTO): Promise<Car> {
    const car: Car = new Car();

    return this.repository.save(car);
  }
}
