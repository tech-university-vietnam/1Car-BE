import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from '../auth/auth.module';
import { BookedRecord } from '../booking/models/bookedRecord.entity';
import { Booking } from '../booking/models/booking.entity';
import { BookingService } from '../booking/services/booking.service';
import { CarModule } from '../car/car.module';
import { CarController } from '../car/controllers/car.controller';
import { Car } from '../car/models/car.entity';
import { CarAttribute } from '../car/models/carAttribute.entity';
import { CarAttributeType } from '../car/models/carAttributeType.entity';
import { User } from '../user/models/user.entity';
import { UserModule } from '../user/user.module';
import { PaymentController } from './controllers/payment.controller';
import { Payment } from './models/payment.entity';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CarModule,
    TypeOrmModule.forFeature([Payment]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([CarAttribute]),
    TypeOrmModule.forFeature([CarAttributeType]),
    TypeOrmModule.forFeature([BookedRecord]),
  ],
  controllers: [PaymentController, CarController],
  providers: [PaymentService, BookingService, StripeService],
})
export class PaymentModule {}
