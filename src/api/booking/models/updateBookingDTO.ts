import { IsEnum, IsOptional, IsString } from 'class-validator';
import { bookingStatus } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  public returnDateTime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public receivedDateTime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public pickUpLocationId?: string;

  @IsEnum(bookingStatus)
  @IsOptional()
  @ApiProperty()
  public bookingStatus?: bookingStatus;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public pickUpStatus?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string;
}
