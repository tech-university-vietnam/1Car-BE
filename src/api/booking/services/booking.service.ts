import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity';
import { CreateBookingDTO } from '../models/booking.dto';

@Injectable()
export class BookingService {
  @InjectRepository(Booking)
  private readonly repository: Repository<Booking>;

  public getBooking(id: string): Promise<Booking> {
    return this.repository.findOneBy({ id: id });
  }

  public createBooking(body: CreateBookingDTO): Promise<Booking> {
    const booking: Booking = new Booking();

    return this.repository.save(booking);
  }
}
