import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarAttributeDto {
  @ApiProperty()
  @IsUUID()
  type: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateCarAttributeTypeDto {
  @ApiProperty()
  @IsString()
  type: string;
}
