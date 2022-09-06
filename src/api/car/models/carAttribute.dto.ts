import { CarAttribute } from './carAttribute.entity';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { CarAttributeType } from '../../../contains';

export class CreateCarAttributeDto {
  @IsUUID()
  type: string;

  @IsString()
  value: string;
}

export class CreateCarAttributeTypeDto {
  @IsString()
  type: string;
}
