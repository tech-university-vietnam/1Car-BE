import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity';
import { Request } from 'express';
import { CarService } from '../../car/services/car.service';
import { CreateBookingDTO } from '../models/booking.dto';

@Injectable()
export class BookingService {
  @InjectRepository(Booking)
  private readonly repository: Repository<Booking>;

  @Inject()
  private readonly carService: CarService;

  public async getBooking(id: string): Promise<Booking> {
    return await this.repository.findOneBy({ id: id });
  }

  public async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return await this.repository.findBy({ userId });
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
