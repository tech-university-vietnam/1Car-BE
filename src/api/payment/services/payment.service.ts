import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, bookingStatus } from 'src/api/booking/models/booking.entity';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { Payment } from '../models/payment.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  @Inject(StripeService)
  private readonly stripeService: StripeService;

  @Inject(DataSource)
  private readonly dataSource: DataSource;

  public async createCheckoutSession(body: CreateCheckoutSessionDTO) {
    // Create booking in our DB
    const booking: Booking = new Booking();
    console.log(body.returnDateTime);
    booking.returnDateTime = new Date(body.returnDateTime);
    booking.totalPrice = body.amount;
    booking.carId = body.carId;
    booking.userId = body.userId;
    booking.pickUpLocationId = body.pickUpLocationId;
    await this.bookingRepository.save(booking);

    return await this.stripeService.createCheckoutSession(
      body.amount,
      'https://www.google.com',
      'https://www.bing.com',
      'BMW',
      booking.id,
    );
  }

  public async handleIntentSuccessWebhook(@Body() body: Stripe.Event) {
    switch (body.type) {
      case 'payment_intent.succeeded':
        // Retrieve data from event
        await this.dataSource.transaction(async (manager) => {
          const intentEvent = body.data.object as Stripe.PaymentIntent;
          console.log(intentEvent);
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
        throw Error(intentEvent.charges.data[0].failure_message);
      default:
        console.log(`Unhandled event type ${body.type}`);
    }
  }
}
