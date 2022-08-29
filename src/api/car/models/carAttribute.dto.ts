import { CarAttribute } from './carAttribute.entity';
import { IsEnum, IsString } from 'class-validator';
import { CarAttributeType } from '../../../contains';

export class CreateCarAttributeDto {
  @IsString()
  value: string;

  @IsEnum(CarAttributeType)
  type: CarAttributeType;
}
