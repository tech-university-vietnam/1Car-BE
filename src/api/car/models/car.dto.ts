import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { CarStatus } from '../../../contains';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsIn([CarStatus.AVAILABLE, CarStatus.UN_AVAILABLE])
  status: CarStatus;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  pricePerDate: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfTrips: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfKilometer: number;

  @ApiProperty()
  @IsString()
  @IsOptional() //locationId of google places api
  locationId: string;

  @ApiProperty()
  @IsFile()
  @IsOptional()
  @MaxFileSize(1e6, { each: true }) //size by bytes 1e6 bytes = 1mb
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile;

  @ApiProperty()
  @IsUUID('all', { each: true })
  attributes: string[];
}

export class CarFilterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  locationId?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsOptional()
  attribute?: string[];
}

export class CarAdminFilterDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  limit?: number;
}
