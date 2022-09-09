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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Booking } from '../models/booking.entity';
import { BookingService } from '../services/booking.service';
import { Request } from 'express';
import { CreateBookingDTO } from '../models/booking.dto';
import { UpdateBookingDTO } from '../models/updateBookingDTO';
import { AdminEndpoint } from '../../../decorators/admin.decorator';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  @Inject(BookingService)
  private readonly service: BookingService;

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user booking' })
  @ApiDefaultResponse({ type: Booking, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public getCurrentUserBookings(@Req() req: Request): Promise<Booking[]> {
    return this.service.getCurrentUserBookings(req.auth.userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking using id' })
  @ApiDefaultResponse({ type: Booking })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public getBooking(@Param('id') id: string): Promise<Booking> {
    return this.service.getBooking(id);
  }

  @AdminEndpoint()
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all booking for admin' })
  @ApiDefaultResponse({ type: Booking, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public getAllBooking(): Promise<Booking[]> {
    return this.service.getAllBooking();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking using UpdateBookingDTO' })
  @ApiBody({ type: UpdateBookingDTO })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async updateBooking(
    @Param('id') id: string,
    @Body() body: UpdateBookingDTO,
  ) {
    return this.service.updateBooking(id, body);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a booking using CreateBookingDTO' })
  @ApiBody({ type: CreateBookingDTO })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCreatedResponse({ type: Booking })
  public async createBooking(
    @Req() request: Request,
    @Body() body: CreateBookingDTO,
  ): Promise<Booking> {
    return await this.service.createBooking(body, request);
  }
}
