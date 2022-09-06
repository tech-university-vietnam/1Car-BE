import { Type } from 'class-transformer';
import {
  IsArray,
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

export class CreateCarDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsIn([CarStatus.AVAILABLE, CarStatus.UN_AVAILABLE])
  status: CarStatus;

  @Type(() => Number)
  @IsNumber()
  pricePerDate: number;

  @IsNumber()
  @IsOptional()
  numberOfTrips: number;

  @IsNumber()
  @IsOptional()
  numberOfKilometer: number;

  @IsString()
  @IsOptional() //locationId of google places api
  locationId: string;

  @IsFile()
  @MaxFileSize(1e6, { each: true }) //size by bytes 1e6 bytes = 1mb
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile;

  @IsUUID('all', { each: true })
  attributes: string[];
}

export class CarFilterDto {
  @IsString()
  @IsOptional()
  locationId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  limit?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString({ each: true })
  @IsOptional()
  attribute?: string[];
}
