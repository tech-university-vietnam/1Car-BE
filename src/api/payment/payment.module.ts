import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Booking } from '../booking/models/booking.entity';
import { BookingService } from '../booking/services/booking.service';
import { CarController } from '../car/controllers/car.controller';
import { Car } from '../car/models/car.entity';
import { CarBrand } from '../car/models/carBrand.entity';
import { CarSize } from '../car/models/carSize.entity';
import { CarType } from '../car/models/carType.entity';
import { CarService } from '../car/services/car.service';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/services/user.service';
import { PaymentController } from './controllers/payment.controller';
import { Payment } from './models/payment.entity';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([CarType]),
    TypeOrmModule.forFeature([CarSize]),
    TypeOrmModule.forFeature([CarBrand]),
  ],
  controllers: [PaymentController, CarController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    PaymentService,
    BookingService,
    StripeService,
    CarService,
  ],
})
export class PaymentModule {}
