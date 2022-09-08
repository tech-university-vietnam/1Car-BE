import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { bookingStatus } from './booking.entity';

export class UpdateBookingDTO {
  @IsString()
  @IsOptional()
  public returnDateTime?: string;

  @IsString()
  @IsOptional()
  public receivedDateTime?: string;

  @IsString()
  @IsOptional()
  public pickUpLocationId?: string;

  @IsEnum(bookingStatus)
  @IsOptional()
  public bookingStatus?: bookingStatus;

  @IsString()
  @IsOptional()
  public pickUpStatus?: string;

  @IsString()
  @IsOptional()
  public description?: string;
}
