import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import Stripe from 'stripe';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { Payment } from '../models/payment.entity';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  @Inject(PaymentService)
  private readonly service: PaymentService;

  @Post('/checkout')
  @ApiCreatedResponse()
  public async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDTO,
    @Res() res: Response,
  ) {
    const session = await this.service.createCheckoutSession(body);
    return res.redirect(session.url);
  }

  @Post('/webhook')
  public async handleIntentWebhook(@Body() body: Stripe.Event) {
    return this.service.handleIntentWebhook(body);
  }
}
