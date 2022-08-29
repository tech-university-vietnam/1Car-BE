import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';
import { Public } from '../../../decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  // This is a protected api
  /**
   * Get user by ID
   * @param id: userId store in database
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public getUser(@Param('id') id: string, @Req() req: Request): Promise<User> {
    console.log(req);
    return this.service.getUser(id);
  }

  /**
   * Get user by token in Authorization header
   * @param req: Request which has been override by auth guard
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public getUserByAuthorization(@Req() req: Request) {
    return this.service.getUserByEmail(req.auth.email);
  }

  // This is a public api
  /**
   * Use to integrate with Auth0
   * Create user only by email
   * @param body: {emai: string}
   */
  @Public()
  @Post()
  @ApiCreatedResponse({ type: User })
  public createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.service.createUser(body);
  }

  /**
   * Update user information from pop up form
   * @param body: Request body
   * @param token
   */
  @Patch()
  public updateUser(
    @Body()
    body: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    return this.service.updateUser(body, req.auth.email);
  }

  @Get('is-first-time')
  public isUserFirstTime(@Req() req: Request): Promise<boolean> {
    return this.service.isUserFirstTime(req.auth.email);
  }
}
