import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  IsFiles,
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
  @IsOptional()
  locationId: string;

  @IsFile()
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile;
}
