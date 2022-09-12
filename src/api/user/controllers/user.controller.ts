import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserByAdminDto,
  UpdateUserDto,
  UpdateUserToAdminDto,
} from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { CreateUser } from '../../../decorators/createUser.decorator';
import { AdminEndpoint } from '../../../decorators/admin.decorator';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user information from token info' })
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async getUserByAuthorization(@Req() req: Request) {
    return { data: await this.service.getUserByEmail(req.auth.email) };
  }

  @Post('admin')
  @ApiBearerAuth()
  @AdminEndpoint()
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiOperation({ summary: 'Create admin account using admin account token' })
  public async createAdmin(@Req() req: Request): Promise<User> {
    if (req.auth?.email) {
      return await this.service.createAdmin(req.auth.email);
    }
  }

  @Patch(':id/admin')
  @ApiBearerAuth()
  @AdminEndpoint()
  @ApiBadRequestResponse()
  @ApiBody({ type: UpdateUserByAdminDto })
  @ApiDefaultResponse({ type: User })
  @ApiOperation({ summary: 'Update user information using admin account' })
  public async updateInfoUsingAdminAccount(
    @Body() body: UpdateUserByAdminDto | UpdateUserToAdminDto,
  ): Promise<User> {
    return await this.service.updateUserInfoUsingAdmin(body);
  }

  @Get('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate user token and return user information' })
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async validateUser(@Req() req: Request) {
    // Expose API for other service
    return {
      user: await this.service.getUserByEmail(req.auth.email),
    };
  }

  /**
   * Get user by ID
   * @param id: userId store in database
   * @param req: Express express
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public getUser(@Param('id') id: string, @Req() req: Request): Promise<User> {
    return this.service.getUser(id);
  }

  @AdminEndpoint()
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user in the database' })
  @ApiDefaultResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async getAllUser(): Promise<User[]> {
    return this.service.getAllUser();
  }

  @AdminEndpoint()
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete this user in the database' })
  public async deleteUser(@Param() params: { id: string }) {
    return this.service.deleteUser(params.id);
  }

  // This is a key-needed api
  /**
   * Use to integrate with Auth0
   * Create user only by email
   * @param body: {email: string, name: string}
   */
  @CreateUser()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create user endpoint for auth0 post registration hook ',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.service.createUser(body);
  }

  /**
   * Update user information from pop up form
   * @param body: Request body
   * @param req Express request
   */
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: UpdateUserDto })
  @ApiDefaultResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  public async updateUser(
    @Body()
    body: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    // From user send body and auth email from token
    return await this.service.updateUser(body, req.auth.email);
  }
}
