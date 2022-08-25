import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/models/booking.entity';
import { PaymentController } from './controllers/payment.controller';
import { Payment } from './models/payment.entity';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, ConfigService],
})
export class PaymentModule {}
