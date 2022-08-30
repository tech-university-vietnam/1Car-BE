import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

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
    amount: number,
    successUrl: string,
    cancelUrl: string,
    carName: string,
    bookingId: string,
  ) =>
    await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: carName,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          bookingId: bookingId,
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
