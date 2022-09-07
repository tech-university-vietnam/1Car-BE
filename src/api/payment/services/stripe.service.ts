import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Booking } from '../../booking/models/booking.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2022-08-01',
      },
    );
  }

  public createCheckoutSession = async (
    booking: Booking,
    successUrl: string,
    cancelUrl: string,
    carName: string,
  ) =>
    await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: carName,
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          bookingId: booking.id,
          receivedDate: booking.receivedDateTime.toISOString(),
          returnDate: booking.returnDateTime.toISOString(),
        },
      },
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

  public constructEvent(
    payload: string | Buffer,
    header: string | string[],
    secret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, header, secret);
  }

  public generateTestHeaderString(payload: string, secret: string) {
    return this.stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });
  }
}
