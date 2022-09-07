import {
  BadRequestException,
  Body,
  Inject,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';
import utils from '../../../utils/utils';
import { BookedRecord } from '../../booking/models/bookedRecord.entity';
import { Booking, bookingStatus } from '../../booking/models/booking.entity';
import { BookingService } from '../../booking/services/booking.service';
import { Car } from '../../car/models/car.entity';
import { CarService } from '../../car/services/car.service';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { Payment } from '../models/payment.entity';
import { StripeService } from './stripe.service';
@Injectable()
export class PaymentService {
  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  @InjectRepository(BookedRecord)
  private readonly bookedRecordRepository: Repository<BookedRecord>;

  @InjectRepository(Car)
  private readonly carRepository: Repository<Car>;

  @Inject(BookingService)
  private readonly bookingService: BookingService;

  @Inject(StripeService)
  private readonly stripeService: StripeService;

  @Inject(CarService)
  private readonly carService: CarService;

  @Inject(DataSource)
  private readonly dataSource: DataSource;

  @Inject(ConfigService)
  private readonly config: ConfigService;

  public async createCheckoutSession(
    body: CreateCheckoutSessionDTO,
    request: Request,
  ) {
    // Create booking in our DB
    const booking = await this.bookingService.createBooking(body, request);
    const car = await this.carService.getCar(body.carId);
    return await this.stripeService.createCheckoutSession(
      booking,
      `http://${this.config.get<string>('CLIENT_BASE_URL')}`,
      `http://${this.config.get<string>('CLIENT_BASE_URL')}`,
      car.name,
    );
  }

  public async handleIntentWebhook(request: RawBodyRequest<Request>) {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
      event = this.stripeService.constructEvent(
        request.rawBody,
        sig,
        this.config.get<string>('STRIPE_INTENT_WEBHOOK_SIG_KEY'),
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Retrieve data from event
        await this.dataSource.transaction(async (manager) => {
          const intentEvent = event.data.object as Stripe.PaymentIntent;
          const stripePaymentId = intentEvent.charges.data[0]
            ? intentEvent.charges.data[0].id
            : null;
          const bookingId = intentEvent.metadata.bookingId;
          const receivedDate = intentEvent.metadata.receivedDate;
          const returnDate = intentEvent.metadata.returnDate;
          // Update booking status
          await manager.update(
            Booking,
            { id: bookingId },
            {
              bookingStatus: bookingStatus.SUCCESS,
            },
          );
          // Update bookedRecord
          const booking = await this.bookingService.getBooking(bookingId);
          if (!booking) throw new BadRequestException('Booking not found');
          const car = await this.carRepository.findOne({
            where: { id: booking.carId },
          });
          await this.bookedRecordRepository.save({
            car: car,
            bookTime: `[${receivedDate}, ${returnDate})`,
          });
          // Create new payment with booking ID
          const newPayment = new Payment();
          newPayment.amount = intentEvent.amount;
          newPayment.bookingId = bookingId;
          newPayment.stripePaymentId = stripePaymentId;
          await manager.save(newPayment);
        });

        break;
      case 'payment_intent.payment_failed':
        const intentEvent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intentEvent.metadata.bookingId;
        await this.bookingRepository.update(bookingId, {
          bookingStatus: bookingStatus.FAIL,
        });
        console.log(intentEvent.charges.data[0].failure_message);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
