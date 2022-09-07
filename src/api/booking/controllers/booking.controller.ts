import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from '../models/booking.entity';
import { BookingService } from '../services/booking.service';
import { Request } from 'express';
import { CreateBookingDTO } from '../models/booking.dto';

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
  public async createBooking(
    @Req() request: Request,
    @Body() body: CreateBookingDTO,
  ): Promise<Booking> {
    return await this.service.createBooking(body, request);
  }
}
