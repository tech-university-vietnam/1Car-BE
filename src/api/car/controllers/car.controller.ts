import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CarService } from '../services/car.service';
import { FormDataRequest } from 'nestjs-form-data';
import mapFilesToArray from '../../../utils/mapFilesToArray';
import { CreateCarAttributeDto } from '../models/carAttribute.dto';
import { CarAttribute } from '../models/carAttribute.entity';

@Controller('car')
@ApiTags('car')
export class CarController {
  @Inject(CarService)
  private readonly service: CarService;

  @Get('/attribute')
  getAttribute(
    @Body() data: CreateCarAttributeDto,
    @Query('type') type?: string,
  ) {
    return this.service.getAttribute(type);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file.buffer);
  }

  @Post('/attribute')
  @ApiCreatedResponse({ type: CarAttribute })
  createAttribute(@Body() data: CreateCarAttributeDto) {
    return this.service.createAttribute(data);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @ApiCreatedResponse({ type: Car })
  public async createCar(@Body() body: CreateCarDTO): Promise<Car> {
    const { images, ...carDetail } = body;
    const files = mapFilesToArray(images);

    const createdCar = await this.service.createCar(
      carDetail,
      files.map((item) => item.buffer),
    );
    return createdCar;
  }

  @Get(':id')
  public getCar(@Param('id') id: string): Promise<Car> {
    return this.service.getCar(id);
  }

  @Get()
  public getAllCar(): Promise<Car[]> {
    return this.service.getAllCar();
  }
}
