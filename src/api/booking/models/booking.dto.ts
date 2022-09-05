import { IsString, IsUUID } from 'class-validator';

export class CreateBookingDTO {
  @IsUUID()
  public carId: string;

  @IsString()
  public returnDateTime: string;

  @IsString()
  public receivedDateTime: string;

  @IsUUID()
  public pickUpLocationId: string;
}
