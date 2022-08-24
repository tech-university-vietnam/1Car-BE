import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { CarModule } from './car/car.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UserModule, PaymentModule, CarModule, BookingModule, RolesModule],
})
export class ApiModule {}
