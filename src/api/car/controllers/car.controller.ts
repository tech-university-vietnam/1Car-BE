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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { CarAttributeType } from '../../../contains';
import mapFilesToArray from '../../../utils/mapFilesToArray';
import { CarFilterDto, CreateCarDTO } from '../models/car.dto';
import { Car } from '../models/car.entity';
import { CreateCarAttributeDto } from '../models/carAttribute.dto';
import { CarAttribute } from '../models/carAttribute.entity';
import { CarService } from '../services/car.service';

@Controller('car')
@ApiTags('car')
export class CarController {
  @Inject(CarService)
  private readonly service: CarService;

  @Get()
  public getAllCar(@Query() filter: CarFilterDto): Promise<Car[]> {
    return this.service.getAllCar(filter);
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

  @Get('/attribute')
  getAttribute(@Query('type') type?: CarAttributeType) {
    return this.service.getAttribute(type);
  }

  @Post('/attribute')
  @ApiCreatedResponse({ type: CarAttribute })
  createAttribute(@Body() data: CreateCarAttributeDto) {
    return this.service.createAttribute(data);
  }

  @Get('/attribute/type')
  @ApiResponse({ type: Array<{ type: string; name: string }> })
  getAttributeType() {
    return this.service.getAllAttributeType();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file.buffer);
  }

  @Get(':id')
  public getCar(@Param('id') id: string): Promise<Car> {
    return this.service.getCar(id);
  }

  @Get(':id/attributes')
  @ApiResponse({ status: 200, description: 'Attributes returned' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  public getCarAttributes(@Param('id') id: string) {
    return this.service.getCarAttributes(id);
  }
}
