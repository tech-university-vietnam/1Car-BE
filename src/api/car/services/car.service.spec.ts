import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { CarController } from '../controllers/car.controller';
import { Car } from '../models/car.entity';
import { CarBrand } from '../models/carBrand.entity';
import { CarSize } from '../models/carSize.entity';
import { CarType } from '../models/carType.entity';
import { CarService } from './car.service';
import * as fs from 'fs';
import axios from 'axios';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { CreateCarDTO } from '../models/car.dto';
import { CarStatus } from '../../../contains';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

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
        TypeOrmModule.forFeature([CarType]),
        TypeOrmModule.forFeature([CarSize]),
        TypeOrmModule.forFeature([CarBrand]),
      ],
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    carService = moduleRef.get(CarService);
    testUtils = new TestUtils(moduleRef.get(DataSource));
    await testUtils.cleanAll(['car']);
    await testUtils.loadAll(['car_brand', 'car_size', 'car_type', 'car']);
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
    };

    const images = [file];

    const createdCar = await carService.createCar(carDetail, images);

    expect(createdCar.name).toBe('Audi A8');
  });
});
