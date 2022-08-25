import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCheckoutSessionDTO {
  @IsNotEmpty()
  public amount: number;

  @IsUUID()
  public userId: string;

  @IsUUID()
  public carId: string;

  @IsString()
  public returnDateTime: string;

  @IsUUID()
  public pickUpLocationId: string;
}
