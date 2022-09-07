import { IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsString()
  @IsOptional()
  public bookingStatus?: string;

  @IsString()
  @IsOptional()
  public pickUpStatus?: string;

  @IsString()
  @IsOptional()
  public description?: string;
}
