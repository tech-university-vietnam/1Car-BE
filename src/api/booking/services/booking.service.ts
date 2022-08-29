import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity';
import { CreateCheckoutSessionDTO } from '../../payment/models/payment.dto';

@Injectable()
export class BookingService {
  @InjectRepository(Booking)
  private readonly repository: Repository<Booking>;

  public getBooking(id: string): Promise<Booking> {
    return this.repository.findOneBy({ id: id });
  }

  public getBookingsByUserId(userId: string): Promise<Booking[]> {
    return this.repository.findBy({ userId });
  }

  public createBooking(body: CreateCheckoutSessionDTO): Promise<Booking> {
    const booking: Booking = new Booking();
    booking.returnDateTime = new Date(body.returnDateTime);
    booking.totalPrice = body.amount;
    booking.carId = body.carId;
    booking.userId = body.userId;
    booking.pickUpLocationId = body.pickUpLocationId;
    return this.repository.save(booking);
  }
}
