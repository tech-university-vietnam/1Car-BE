import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/services/user.service';
import {
  checkUserHaveEnoughInfo,
  getAuthorizationFromCtx,
  getTokenFromAuthorizationString,
} from '../../../utils/helpers';
import { ExceptionMessage } from '../constants';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../user/models/user.dto';

// Return unauthorized in case that is truly unauthorized,
// Return Bad Request if there is missing info
@Injectable()
export class JwtAuthGuard extends AuthGuard('package-jwt') {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;
    else {
      // If is not public then check the user
      const token = getTokenFromAuthorizationString(
        getAuthorizationFromCtx(ctx),
      );
      let err = null;
      let user = null;

      if (token) {
        const request: Request = ctx.switchToHttp().getRequest();

        const decodedToken = this.authService.decodeTokenToObject(token);
        const email = this.authService.fromTokenGetEmail(decodedToken);
        user = await this.userService.getUserByEmail(email);
        if (user) {
          request.auth = {
            token,
            email,
            userId: user.id,
          };
        } else {
          const isMissingInfo = checkUserHaveEnoughInfo(user);
          if (isMissingInfo) {
            err = new HttpException(
              ExceptionMessage.USER_NEED_UPDATE_INFO,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            this.userService.createUser(new CreateUserDto(email, email));
            err = new HttpException(
              ExceptionMessage.USER_NEED_UPDATE_INFO,
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        if (
          new Date(decodedToken['exp'] * 1000).getTime() < new Date().getTime()
        ) {
          err = new HttpException(
            ExceptionMessage.TOKEN_EXPIRED,
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        err = new HttpException(
          ExceptionMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.handleRequest(err, user);
      return !!user;
    }
  }

  handleRequest(err, user) {
    // throw err if there is any
    if (err) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
