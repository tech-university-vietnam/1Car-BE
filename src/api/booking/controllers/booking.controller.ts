import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from '../models/booking.entity';
import { CreateBookingDTO } from '../models/booking.dto';
import { BookingService } from '../services/booking.service';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  @Inject(BookingService)
  private readonly service: BookingService;

  @Get(':id')
  public getBooking(@Param('id') id: string): Promise<Booking> {
    return this.service.getBooking(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Booking })
  public createBooking(@Body() body: CreateBookingDTO): Promise<Booking> {
    return this.service.createBooking(body);
  }
}
