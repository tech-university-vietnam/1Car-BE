import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookingDTO } from './booking.dto';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';

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
