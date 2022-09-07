import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { CarModule } from './car/car.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, PaymentModule, CarModule, BookingModule, AuthModule],
  exports: [UserModule, AuthModule],
})
export class ApiModule {}
