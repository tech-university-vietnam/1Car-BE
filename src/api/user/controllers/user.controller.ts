import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { CreateUser } from '../../../decorators/createUser.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  /**
   * Get user by token in Authorization header
   * @param req: Request which has been override by auth guard
   */
  @Get('me')
  public async getUserByAuthorization(@Req() req: Request) {
    return { data: await this.service.getUserByEmail(req.auth.email) };
  }

  @Post('admin')
  public async createAdmin(@Req() req: Request): Promise<User> {
    if (req.auth?.email) {
      return await this.service.createAdmin(req.auth.email);
    }
  }

  @Get('validate')
  public async validateUser(@Req() req: Request) {
    // Expose API for other service
    return {
      user: await this.service.getUserByEmail(req.auth.email),
    };
  }

  // This is a protected api
  /**
   * Get user by ID
   * @param id: userId store in database
   * @param req: Express express
   */
  @Get(':id')
  public getUser(@Param('id') id: string, @Req() req: Request): Promise<User> {
    return this.service.getUser(id);
  }

  // This is a public api
  /**
   * Use to integrate with Auth0
   * Create user only by email
   * @param body: {email: string, name: string}
   */
  @CreateUser()
  @Post()
  @ApiCreatedResponse({ type: User })
  public async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.service.createUser(body);
  }

  /**
   * Update user information from pop up form
   * @param body: Request body
   * @param req Express request
   */
  @Patch()
  public async updateUser(
    @Body()
    body: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    // From user send body and auth email from token
    return await this.service.updateUser(body, req.auth.email);
  }
}
