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
  getAuthorizationFromCtx,
  getTokenFromAuthorizationString,
  isTokenExpired,
} from '../../../utils/helpers';
import { ExceptionMessage } from '../constants';
import { AuthService } from '../services/auth.service';
import { IS_CREATE_USER_KEY } from '../../../decorators/createUser.decorator';
import { User } from '../../user/models/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('package-jwt') {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super();
  }

  private async processError(
    ctx: ExecutionContext,
    token: string,
  ): Promise<{
    err: any | null;
    user: User | null;
  }> {
    let user = null;
    const err = null;
    if (!token) {
      return {
        err: new UnauthorizedException(),
        user,
      };
    }

    const request: Request = ctx.switchToHttp().getRequest();

    // Check if there is a token that can be decoded
    const decodedToken = this.authService.decodeTokenToObject(token);
    if (!decodedToken)
      return {
        err: new UnauthorizedException(),
        user,
      };

    // Check if token is expired or not
    if (decodedToken['exp'] && isTokenExpired(decodedToken['exp'])) {
      return {
        err: new HttpException(
          ExceptionMessage.TOKEN_EXPIRED,
          HttpStatus.UNAUTHORIZED,
        ),
        user,
      };
    }

    // Check if it is a valid user
    const email = this.authService.fromTokenGetEmail(decodedToken);
    user = await this.userService.getUserByEmail(email);
    if (user) {
      request.auth = {
        token,
        email,
        userId: user.id,
      };
      return { err, user };
    }

    return {
      err: new UnauthorizedException(),
      user,
    };
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // If is public endpoint with @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    // If is update endpoint from auth0 with @Update() decorator
    const isCreateUser = this.reflector.getAllAndOverride<boolean>(
      IS_CREATE_USER_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    const authorizationString = getAuthorizationFromCtx(ctx);
    if (isCreateUser) {
      return authorizationString === process.env.AUTH0_SECRET_TOKEN;
    }

    // If is not public and update endpoint then check the user
    const token = getTokenFromAuthorizationString(authorizationString);
    const { err, user } = await this.processError(ctx, token);
    this.handleRequest(err, user);
    return !!user;
  }

  handleRequest(err, user) {
    // throw err if there is any
    if (err) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
