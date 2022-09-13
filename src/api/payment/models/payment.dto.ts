import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDTO {
  @ApiProperty()
  @IsUUID()
  public carId: string;

  @ApiProperty()
  @IsString()
  public returnDateTime: string;

  @ApiProperty()
  @IsString()
  public receivedDateTime: string;

  @ApiProperty()
  @IsString()
  public pickUpLocationId: string;
}
