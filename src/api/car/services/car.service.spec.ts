import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import axios from 'axios';
import * as fs from 'fs';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { CarAttributeType, CarStatus } from '../../../contains';
import { TestUtils } from '../../../utils/testUtils';
import { CarController } from '../controllers/car.controller';
import { CarFilterDto } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CreateCarAttributeDto } from '../models/carAttribute.dto';
import { CarAttribute } from '../models/carAttribute.entity';
import { CarService } from './car.service';

jest.mock('axios');

describe('CarService', () => {
  let moduleRef: TestingModule;
  let carService: CarService;
  let testUtils: TestUtils;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        NestjsFormDataModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Car]),
        TypeOrmModule.forFeature([CarAttribute]),
      ],
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    carService = moduleRef.get(CarService);
    testUtils = new TestUtils(moduleRef.get(DataSource));

    await testUtils.cleanAll([
      'car_attributes_car_attribute',
      'car',
      'car_attribute',
    ]);
    await testUtils.loadAll(['car_attribute', 'car']);
  });

  afterEach(async () => {
    await moduleRef.close();
    jest.clearAllMocks();
  });

  it('should return an array of cars', async () => {
    expect(await carService.getAllCar()).toHaveLength(1);
  });

  it('should get the file and return response', async () => {
    (axios.post as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            id: 'SR55YbS',
            title: 'image',
            url_viewer: 'https://ibb.co/SR55YbS',
            url: 'https://i.ibb.co/72jjMPh/image.png',
            display_url: 'https://i.ibb.co/6grr9zQ/image.png',
            width: '1536',
            height: '768',
            size: 639055,
            time: '1661404780',
            expiration: '600',
            image: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/72jjMPh/image.png',
            },
            thumb: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/SR55YbS/image.png',
            },
            medium: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/6grr9zQ/image.png',
            },
            delete_url:
              'https://ibb.co/SR55YbS/33bd8457301b82cb8ccddfceda7fa4ab',
          },
          success: true,
          status: 200,
        },
      }),
    );

    const mockFile = path.join(__dirname, '../../../mocks/mock-image.png');
    const file = fs.readFileSync(mockFile);

    const data = await carService.uploadImage(file);
    expect(data.data.image.filename).toBe('image.png');
  });

  it('should throw the error when upload failed', async () => {
    (axios.post as jest.Mock).mockImplementation(() => Promise.reject('error'));

    const mockFile = path.join(__dirname, '../../../mocks/mock-image.png');
    const file = fs.readFileSync(mockFile);
    try {
      await carService.uploadImage(file);
    } catch (err) {
      expect(err).toBeInstanceOf(BadGatewayException);
    }
  });

  it('should created a car and return car detail', async () => {
    (axios.post as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            id: 'SR55YbS',
            title: 'image',
            url_viewer: 'https://ibb.co/SR55YbS',
            url: 'https://i.ibb.co/72jjMPh/image.png',
            display_url: 'https://i.ibb.co/6grr9zQ/image.png',
            width: '1536',
            height: '768',
            size: 639055,
            time: '1661404780',
            expiration: '600',
            image: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/72jjMPh/image.png',
            },
            thumb: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/SR55YbS/image.png',
            },
            medium: {
              filename: 'image.png',
              name: 'image',
              mime: 'image/png',
              extension: 'png',
              url: 'https://i.ibb.co/6grr9zQ/image.png',
            },
            delete_url:
              'https://ibb.co/SR55YbS/33bd8457301b82cb8ccddfceda7fa4ab',
          },
          success: true,
          status: 200,
        },
      }),
    );
    const mockFile = path.join(__dirname, '../../../mocks/mock-image.png');
    const file = fs.readFileSync(mockFile);

    const carDetail = {
      name: 'Audi A8',
      description: 'Some words about this car',
      status: CarStatus.AVAILABLE,
      pricePerDate: 10000,
      numberOfTrips: 10,
      numberOfKilometer: 10,
      locationId: 'string',
      attributes: ['3926cd59-cd4b-4bbc-821d-21800019780f'],
    };

    const images = [file];

    const createdCar = await carService.createCar(carDetail, images);

    expect(createdCar.name).toBe('Audi A8');
  });

  it('should create an attribute and return attribute detail', async () => {
    const testAttribute: CreateCarAttributeDto = {
      type: CarAttributeType.BRAND,
      value: 'Ferrari',
    };

    const attribute = await carService.createAttribute(testAttribute);

    expect(attribute.value).toBe('Ferrari');
  });

  it('should return a list of car attribute', async () => {
    // 5 brand attribute that have inserted to DB
    const listAttributeBrand = await carService.getAttribute(
      CarAttributeType.BRAND,
    );
    expect(listAttributeBrand).toHaveLength(5);

    // 10 attribute that have inserted to DB
    const allAttributes = await carService.getAttribute();
    expect(allAttributes).toHaveLength(10);
  });

  it('should return list attribute from list ID', async () => {
    // 3 attribute that have inserted to DB & reduce the duplicate ids
    const listAttribute = await carService.getAttributesFromIds([
      'd43eceb9-36fd-4500-ac46-68cc3ea433da',
      '869562b6-a012-4b55-becb-efbabd804de9',
      '477004fa-bcb1-4abd-83ee-c99175532c17',
      '477004fa-bcb1-4abd-83ee-c99175532c17',
    ]);
    expect(listAttribute).toHaveLength(3);
  });

  it('should throw error if attribute not found', async () => {
    try {
      // 3 attribute that have inserted to DB & reduce the duplicate ids
      const listAttribute = await carService.getAttributesFromIds([
        'd43eceb9-36fd-4500-ac46-68cc3ea433dc', //this is wrong attribute id
        '869562b6-a012-4b55-becb-efbabd804de9',
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '477004fa-bcb1-4abd-83ee-c99175532c17',
      ]);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return list of current attribute types', async () => {
    const attributeList = carService.getAllAttributeType();
    expect(attributeList).toHaveLength(3);
    expect(attributeList[0]).toEqual({ type: 'brand', name: 'brand' });
  });

  it('should return list of 1 car with status Available by default', async () => {
    const unavailableCar = {
      name: 'New Car 2',
      description: 'New Car',
      attributes: [
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '3926cd59-cd4b-4bbc-821d-21800019780f',
      ],
      numberOfTrips: 0,
      numberOfKilometer: 0,
      locationId: '',
      pricePerDate: 100,
      status: CarStatus.UN_AVAILABLE,
    };

    // now we have 2 cars, one from mock and one from creation bellow
    await carService.createCar(unavailableCar, []);

    const filter = undefined;

    const cars = await carService.getAllCar(filter);

    expect(cars).toHaveLength(1);
    cars.forEach((item) => expect(item.status).toBe(CarStatus.AVAILABLE));
  });

  it('should return list of 2 cars with status Available by default', async () => {
    const availableCar = {
      name: 'New Car 2',
      description: 'New Car',
      attributes: [
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '3926cd59-cd4b-4bbc-821d-21800019780f',
      ],
      numberOfTrips: 0,
      numberOfKilometer: 0,
      locationId: '',
      pricePerDate: 100,
      status: CarStatus.AVAILABLE,
    };

    // now we have 2 cars, one from mock and one from creation bellow
    await carService.createCar(availableCar, []);

    const filter = undefined;

    const cars = await carService.getAllCar(filter);

    expect(cars).toHaveLength(2);
    cars.forEach((item) => expect(item.status).toBe(CarStatus.AVAILABLE));
  });

  it('should return list of 1 cars with status Available with page = 2, limit = 1', async () => {
    const availableCar = {
      name: 'New Car 2',
      description: 'New Car',
      attributes: [
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '3926cd59-cd4b-4bbc-821d-21800019780f',
      ],
      numberOfTrips: 0,
      numberOfKilometer: 0,
      locationId: '',
      pricePerDate: 100,
      status: CarStatus.AVAILABLE,
    };

    // now we have 2 cars, one from mock and one from creation bellow
    await carService.createCar(availableCar, []);

    const filter = { page: 2, limit: 1 };
    const cars = await carService.getAllCar(filter);

    expect(cars).toHaveLength(1);
    cars.forEach((item) => expect(item.status).toBe(CarStatus.AVAILABLE));
    expect(cars[0].name).toBe('New Car 1');
  });

  it('should return list of 1 car with brand = "350Z"', async () => {
    const availableCar = {
      name: 'New Car 2',
      description: 'New Car',
      attributes: [
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '3926cd59-cd4b-4bbc-821d-21800019780f',
      ],
      numberOfTrips: 0,
      numberOfKilometer: 0,
      locationId: '',
      pricePerDate: 100,
      status: CarStatus.AVAILABLE,
    };

    await carService.createCar(availableCar, []);

    const filter = { brand: '350Z' };
    const cars = await carService.getAllCar(filter);

    expect(cars).toHaveLength(1);
    cars.forEach((item) => expect(item.attributes[0].type).toBe('brand'));
    cars.forEach((item) => expect(item.attributes[0].value).toBe('350Z'));
  });

  it('should return empty with brand = "350Z-fake"', async () => {
    const availableCar = {
      name: 'New Car 2',
      description: 'New Car',
      attributes: [
        '477004fa-bcb1-4abd-83ee-c99175532c17',
        '3926cd59-cd4b-4bbc-821d-21800019780f',
      ],
      numberOfTrips: 0,
      numberOfKilometer: 0,
      locationId: '',
      pricePerDate: 100,
      status: CarStatus.AVAILABLE,
    };

    await carService.createCar(availableCar, []);

    const filter = { brand: '350Z-fake' };
    const cars = await carService.getAllCar(filter);

    expect(cars).toHaveLength(0);
  });
});
