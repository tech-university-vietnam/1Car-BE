import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
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
