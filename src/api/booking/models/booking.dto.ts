import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDTO {
  @IsUUID()
  @ApiProperty()
  public carId: string;

  @IsString()
  @ApiProperty()
  public returnDateTime: string;

  @IsString()
  @ApiProperty()
  public receivedDateTime: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public pickUpLocationId: string;
}
