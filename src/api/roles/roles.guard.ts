import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs/internal/Observable';
import { UserRole } from '../user/models/user.entity';
import { RolesService } from './roles.service';
import { ROLE_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRole = this.reflector.getAllAndOverride<UserRole>(
        ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRole) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      return await this.rolesService.validateRequestWithUserRole(
        request,
        requiredRole,
      );
    } catch (ex: any) {
      throw ex;
    }
  }
}
