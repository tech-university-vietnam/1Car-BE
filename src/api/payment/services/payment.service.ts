import { Body, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';
import { Booking, bookingStatus } from '../../booking/models/booking.entity';
import { BookingService } from '../../booking/services/booking.service';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { Payment } from '../models/payment.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  @Inject(BookingService)
  private readonly bookingService: BookingService;

  @Inject(StripeService)
  private readonly stripeService: StripeService;

  @Inject(DataSource)
  private readonly dataSource: DataSource;

  @Inject(ConfigService)
  private readonly config: ConfigService;

  public async createCheckoutSession(body: CreateCheckoutSessionDTO) {
    // Create booking in our DB
    const booking = await this.bookingService.createBooking(body);

    console.log(this.config.get<string>('CLIENT_BASE_URL'));
    return await this.stripeService.createCheckoutSession(
      body.amount,
      `http://${this.config.get<string>('CLIENT_BASE_URL')}`,
      `http://${this.config.get<string>('CLIENT_BASE_URL')}`,
      'BMW',
      booking.id,
    );
  }

  public async handleIntentWebhook(@Body() body: Stripe.Event) {
    switch (body.type) {
      case 'payment_intent.succeeded':
        // Retrieve data from event
        await this.dataSource.transaction(async (manager) => {
          const intentEvent = body.data.object as Stripe.PaymentIntent;
          const stripePaymentId = intentEvent.charges.data[0]
            ? intentEvent.charges.data[0].id
            : null;
          const bookingId = intentEvent.metadata.bookingId;
          // Update booking status
          await manager.update(
            Booking,
            { id: bookingId },
            {
              bookingStatus: bookingStatus.SUCCESS,
            },
          );
          // Create new payment with booking ID
          const newPayment = new Payment();
          newPayment.amount = intentEvent.amount;
          newPayment.bookingId = bookingId;
          newPayment.stripePaymentId = stripePaymentId;

          await manager.save(newPayment);
        });

        break;
      case 'payment_intent.payment_failed':
        const intentEvent = body.data.object as Stripe.PaymentIntent;
        const bookingId = intentEvent.metadata.bookingId;
        await this.bookingRepository.update(bookingId, {
          bookingStatus: bookingStatus.FAIL,
        });
        console.log(intentEvent.charges.data[0].failure_message);
        break;
      default:
        console.log(`Unhandled event type ${body.type}`);
    }
  }
}
