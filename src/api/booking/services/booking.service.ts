import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity';
import { Request } from 'express';
import { CarService } from '../../car/services/car.service';
import { CreateBookingDTO } from '../models/booking.dto';
import { UpdateBookingDTO } from '../models/updateBookingDTO';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserService } from '../../../api/user/services/user.service';
import { User } from '../../../api/user/models/user.entity';
import { Car } from '../../../api/car/models/car.entity';

interface BookingWithUserDto extends Booking {
  user: User;
  car: Car;
}

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly userService: UserService,
    private readonly carService: CarService,
  ) {}

  public async getBooking(id: string): Promise<Booking> {
    return await this.repository.findOneBy({ id: id });
  }

  public async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return await this.repository.findBy({ userId });
  }

  public async getAllBooking(): Promise<BookingWithUserDto[]> {
    const bookings = await this.repository.find();

    const result: BookingWithUserDto[] = [];
    await Promise.all(
      bookings.map(async (item) => {
        const user = await this.userService.getUser(item.userId);
        const car = await this.carService.getCar(item.carId);
        const itemResult = {
          ...item,
          user,
          car,
        };
        result.push(itemResult);
      }),
    );

    return result;
  }

  public async updateBooking(id: string, body: UpdateBookingDTO) {
    const post = body as QueryDeepPartialEntity<Booking>;
    return await this.repository.update(id, post);
  }

  public async createBooking(
    body: CreateBookingDTO,
    request: Request,
  ): Promise<Booking> {
    const amount = await this.calculateTotalPrice(
      body.receivedDateTime,
      body.returnDateTime,
      body.carId,
    );
    const booking: Booking = new Booking();
    booking.totalPrice = amount;
    booking.returnDateTime = new Date(body.returnDateTime);
    booking.receivedDateTime = new Date(body.receivedDateTime);
    booking.carId = body.carId;
    booking.userId = request.auth.userId;
    booking.pickUpLocationId = body.pickUpLocationId;
    return await this.repository.save(booking);
  }

  public async calculateTotalPrice(
    receivedDateTime: string,
    returnDateTime: string,
    carId: string,
  ) {
    const receivedDate = new Date(receivedDateTime);
    const returnDate = new Date(returnDateTime);
    const daysRented = Math.floor(
      (returnDate.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const car = await this.carService.getCar(carId);
    const pricePerDate = car?.pricePerDate ?? 0;
    return pricePerDate * daysRented;
  }
}
