import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from '../../car/car.module';
import { Car } from '../../car/models/car.entity';
import { CarService } from '../../car/services/car.service';
import { UserService } from '../../user/services/user.service';
import { UserModule } from '../../user/user.module';
import { Booking } from '../models/booking.entity';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  const car = {
    id: '3926cd59-cd4b-4bbc-821d-21800019780f',
    name: 'New Car 1',
    description: 'New Car',
    pricePerDate: 100,
  };
  const booking = {
    id: '40952ee9-64b3-4bce-95fc-10f27339d2a3',
    userId: '63c4f298-a75e-424e-998e-55f396a97d61',
    carId: car.id,
    returnDateTime: new Date('2018-01-15T08:54:45.000Z'),
    receivedDateTime: new Date('2018-01-25T08:54:45.000Z'),
    totalPrice: 4000,
    pickUpLocationId: '2711ad44-d7a2-4a3a-bcbe-c8d520d4ef6e',
  } as any;
  const user = {
    id: '3e306bb8-ac97-4c25-8f7a-44d11abcb1c1',
    name: 'Macaque, japanese',
    email: 'giannini0@gnu.org',
  };
  const request = {
    auth: {
      userId: '3e306bb8-ac97-4c25-8f7a-44d11abcb1c1',
    },
  } as any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        UserService,
        CarService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            findOneBy: jest.fn(() => Promise.resolve(booking)),
            findBy: jest.fn(() => Promise.resolve([booking])),
            find: jest.fn(() => Promise.resolve([booking])),
            save: jest.fn(() => Promise.resolve(booking)),
            update: jest.fn(() => Promise.resolve(booking)),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(() => Promise.resolve(user)),
          },
        },
        {
          provide: CarService,
          useValue: {
            getCar: jest.fn(() => Promise.resolve(car)),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('get booking -> should return booking', async () => {
    const result = await service.getBooking(booking.id);
    expect(result).toEqual(booking);
  });

  it('get current user bookings -> should return bookings', async () => {
    const result = await service.getCurrentUserBookings(user.id);
    expect(result).toEqual([booking]);
  });

  it('get all bookings -> should return bookings with user', async () => {
    const result = await service.getAllBooking();
    expect(result).toEqual([
      {
        ...booking,
        user,
        car,
      },
    ]);
  });

  it('create booking -> should return booking', async () => {
    const result = await service.createBooking(booking, request);
    expect(result).toEqual(booking);
  });

  it('update booking -> should return booking', async () => {
    const result = await service.updateBooking(booking, request);
    expect(result).toEqual(booking);
  });

  it('calculateTotalPrice -> should return total price (total rented days * price per date)', async () => {
    const returnDateTime = '2018-01-25T08:54:45.000Z';
    const receivedDateTime = '2018-01-15T08:54:45.000Z';
    const result = await service.calculateTotalPrice(
      receivedDateTime,
      returnDateTime,
      car.id,
    );
    expect(result).toEqual(1000); // 10 days * 100$ per day
  });
});
