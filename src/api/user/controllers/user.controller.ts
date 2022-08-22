import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get(':id')
  public getUser(@Param('id') id: string): Promise<User> {
    return this.service.getUser(id);
  }

  @Post()
  @ApiCreatedResponse({ type: User })
  public createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.service.createUser(body);
  }
}
