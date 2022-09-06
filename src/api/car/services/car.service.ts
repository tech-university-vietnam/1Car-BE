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
    // const attributeFromQuery = Object.keys(CarAttributeType)
    //   .map((item) => ({
    //     type: CarAttributeType[item],
    //     value: filter[CarAttributeType[item]],
    //   }))
    //   .filter((item) => item.value != undefined);

    // const attributeType = attributeFromQuery.map((item) => item.type);

    // const queryForAttribute =
    //   attributeType.length > 0
    //     ? attributeType
    //         .map(
    //           (type) =>
    //             `car_attribute.type = '${type}' and car_attribute.value = :${type}`,
    //         )
    //         .join(' or ')
    //     : '1 = 1';

    // const paramsForAttribute =
    //   attributeType.length > 0
    //     ? Object.fromEntries(attributeType.map((key) => [key, filter[key]]))
    //     : {};

    if (typeof filter?.attribute == 'string') {
      filter.attribute = [filter.attribute];
    }

    //TODO: check startDate & endDate here
    const data = await this.carRepository
      .createQueryBuilder('car')
      .where('car.status = :status', { status: CarStatus.AVAILABLE })
      .orderBy('car.createdAt', 'DESC')
      .leftJoinAndSelect('car.attributes', 'car_attribute')
      .leftJoinAndSelect('car_attribute.type', 'type')
      .andWhere(
        filter.attribute?.length > 0
          ? 'car_attribute.id IN(:...attributes)'
          : '1 = 1',
        {
          attributes: filter.attribute,
        },
      )
      .take(filter.limit || 10)
      .skip((filter.limit || 10) * ((filter.page || 1) - 1))
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
