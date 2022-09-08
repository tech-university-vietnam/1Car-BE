import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from '../models/booking.entity';
import { BookingService } from '../services/booking.service';
import { Request } from 'express';
import { CreateBookingDTO } from '../models/booking.dto';
import { UpdateBookingDTO } from '../models/updateBookingDTO';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  @Inject(BookingService)
  private readonly service: BookingService;

  @Get(':id')
  public getBooking(@Param('id') id: string): Promise<Booking> {
    return this.service.getBooking(id);
  }

  @Get()
  public getAllBooking(): Promise<Booking[]> {
    return this.service.getAllBooking();
  }

  @Patch(':id')
  public async updateBooking(
    @Param('id') id: string,
    @Body() body: UpdateBookingDTO,
  ) {
    return this.service.updateBooking(id, body);
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
