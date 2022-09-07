import { CarStatus } from './../../../contains/index';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as FormData from 'form-data';
import * as _ from 'lodash';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CarFilterDto, CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import {
  CreateCarAttributeDto,
  CreateCarAttributeTypeDto,
} from '../models/carAttribute.dto';
import { CarAttribute } from './../models/carAttribute.entity';
import { CarAttributeType } from '../models/carAttributeType.entity';

@Injectable()
export class CarService {
  @InjectRepository(Car)
  private readonly carRepository: Repository<Car>;

  @InjectRepository(CarAttribute)
  private readonly carAttributeRepository: Repository<CarAttribute>;

  @InjectRepository(CarAttributeType)
  private readonly carAttributeTypeRepository: Repository<CarAttributeType>;

  public getCar(id: string): Promise<Car> {
    return this.carRepository.findOneBy({ id: id });
  }

  public async createCar(
    carDetail: Omit<CreateCarDTO, 'images'>,
    images: Buffer[],
  ): Promise<Car> {
    if (typeof carDetail.attributes == 'string')
      carDetail.attributes = [carDetail.attributes];

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

    await this.carRepository.save(car);

    return car;
  }

  public async getAllCar(
    filter: CarFilterDto = {
      locationId: '',
      page: 1,
      limit: 10,
      startDate: '',
      endDate: '',
    },
  ): Promise<Car[]> {
    if (typeof filter?.attribute == 'string') {
      filter.attribute = [filter.attribute];
    }

    const queryForAttribute =
      filter.attribute?.length > 0
        ? filter.attribute
            .map((id) => `car_attribute.id = '${id}'`)
            .join(' and ')
        : '1 = 1';

    const queryForRangeDate =
      filter.startDate && filter.endDate
        ? `NOT booked_record.bookTime && :date`
        : `1 = 1`;
    //TODO: check startDate & endDate here
    const bookingRange = `[${filter.startDate}, ${filter.endDate})`;
    const data = await this.carRepository
      .createQueryBuilder('car')
      .where('car.status = :status', { status: CarStatus.AVAILABLE })
      .orderBy('car.createdAt', 'DESC')
      .leftJoinAndSelect('car.attributes', 'car_attribute')
      .leftJoinAndSelect('car_attribute.type', 'type')
      .leftJoinAndSelect('car.bookTime', 'booked_record')
      .andWhere(queryForRangeDate, { date: bookingRange })
      .andWhere(queryForAttribute)
      .take(filter.limit || 10)
      .skip((filter.limit || 10) * ((filter.page || 1) - 1))
      .getMany();

    return data;
  }

  public async getCarAttributes(id: string) {
    const data = await this.carRepository
      .createQueryBuilder('car')
      .where('car.id = :id', { id })
      .leftJoinAndSelect('car.attributes', 'car_attribute')
      .getOne();

    if (!data) {
      throw new NotFoundException('Car not found');
    }

    // return data.attributes.reduce((accum, attribute) => {
    //   accum[attribute.type] = attribute.value;
    //   return accum;
    // }, {});
    return null;
  }

  public async checkCarAvailability(startDate, endDate) {
    return false;
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
      relations: ['type'],
    });

    if (result.length != listReducedDuplicateIds.length)
      throw new BadRequestException('Attribute not found');

    return result;
  }

  public async createAttributeType(typeDetail: CreateCarAttributeTypeDto) {
    const attribute = await this.carAttributeTypeRepository.save(typeDetail);

    return attribute;
  }

  public async createAttribute(attributeDetail: CreateCarAttributeDto) {
    const { type, ...data } = attributeDetail;
    const typeData = await this.getAttributeType(type);

    const attribute = await this.carAttributeRepository.create({
      ...data,
    });

    attribute.type = typeData;

    const result = await this.carAttributeRepository.save(attribute);

    return result;
  }

  public async getAttribute() {
    const filter: FindManyOptions<CarAttribute> = {};

    const result = await this.carAttributeRepository
      .createQueryBuilder('attribute')
      .leftJoinAndSelect('attribute.type', 'type')
      .getMany();

    return result;
  }

  public async getAllAttributeType(): Promise<CarAttributeType[]> {
    const type = await this.carAttributeTypeRepository.find();

    return type;
  }

  public async getAttributeType(typeId: string): Promise<CarAttributeType> {
    const type = await this.carAttributeTypeRepository.findOne({
      where: { id: typeId },
    });

    if (!type) throw new NotFoundException('Type not found');

    return type;
  }
}
