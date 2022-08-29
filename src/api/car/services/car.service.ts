import { CarAttributeType } from './../../../contains/index';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as FormData from 'form-data';
import * as _ from 'lodash';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CreateCarAttributeDto } from '../models/carAttribute.dto';
import { CarAttribute } from './../models/carAttribute.entity';

@Injectable()
export class CarService {
  @InjectRepository(Car)
  private readonly carRepository: Repository<Car>;

  @InjectRepository(CarAttribute)
  private readonly carAttributeRepository: Repository<CarAttribute>;

  public getCar(id: string): Promise<Car> {
    return this.carRepository.findOneBy({ id: id });
  }

  public async createCar(
    carDetail: Omit<CreateCarDTO, 'images'>,
    images: Buffer[],
  ): Promise<Car> {
    const listAttributes = await this.getAttributesFromIds(
      carDetail.attributes,
    );

    const uploadResult = [];
    for (const image of images) {
      const result = await this.uploadImage(image);
      uploadResult.push(result.data?.display_url);
    }

    const car: Car = this.carRepository.create({
      ...carDetail,
      attributes: listAttributes,
      images: uploadResult,
    });
    return this.carRepository.save(car);
  }

  public async getAllCar(): Promise<Car[]> {
    const data = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.attributes', 'car_attribute')
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

  public async getAttributesFromIds(listId: string[]) {
    const listReducedDuplicateIds = _.uniq(listId);

    const result = await this.carAttributeRepository.find({
      where: {
        id: In(listReducedDuplicateIds),
      },
    });

    if (result.length != listReducedDuplicateIds.length)
      throw new BadRequestException('Attribute not found');

    return result;
  }

  public async createAttribute(attributeDetail: CreateCarAttributeDto) {
    const result = await this.carAttributeRepository.save(attributeDetail);

    return result;
  }

  public async getAttribute(type?: CarAttributeType) {
    const filter: FindManyOptions<CarAttribute> = {};

    if (type) filter.where = { type: type };

    const result = await this.carAttributeRepository.find(filter);

    return result;
  }

  public getAllAttributeType(): any[] {
    return Object.keys(CarAttributeType).map((item) => ({
      type: CarAttributeType[item],
      name: CarAttributeType[item],
    }));
  }
}
