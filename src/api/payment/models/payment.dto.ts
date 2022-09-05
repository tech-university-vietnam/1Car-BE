import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCheckoutSessionDTO {
  @IsUUID()
  public carId: string;

  @IsString()
  public returnDateTime: string;

  @IsString()
  public receivedDateTime: string;

  @IsUUID()
  public pickUpLocationId: string;
}
