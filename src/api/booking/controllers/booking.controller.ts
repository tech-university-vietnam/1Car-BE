import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from '../models/booking.entity';
import { CreateBookingDTO } from '../models/booking.dto';
import { BookingService } from '../services/booking.service';
import { CreateCheckoutSessionDTO } from '../../payment/models/payment.dto';

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
  public createBooking(
    @Body() body: CreateCheckoutSessionDTO,
  ): Promise<Booking> {
    return this.service.createBooking(body);
  }
}
