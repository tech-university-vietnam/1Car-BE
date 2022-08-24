import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { CarController } from '../controllers/car.controller';
import { Car } from '../models/car.entity';
import { CarBrand } from '../models/carBrand.entity';
import { CarSize } from '../models/carSize.entity';
import { CarType } from '../models/carType.entity';
import { CarService } from './car.service';

describe('CarService', () => {
  let moduleRef: TestingModule;
  let carService: CarService;
  let testUtils: TestUtils;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
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
  });

  it('should return an array of cars', async () => {
    expect(await carService.getAllCar()).toHaveLength(1);
  });
});
