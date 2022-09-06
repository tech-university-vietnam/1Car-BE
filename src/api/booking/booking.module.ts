import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Car } from '../car/models/car.entity';
import { CarAttribute } from '../car/models/carAttribute.entity';
import { CarService } from '../car/services/car.service';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/services/user.service';
import { BookingController } from './controllers/booking.controller';
import { Booking } from './models/booking.entity';
import { BookingService } from './services/booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([CarAttribute]),
  ],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService, CarService, UserService, AuthService, JwtService],
})
export class BookingModule {}
