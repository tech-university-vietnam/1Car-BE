import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../user/models/user.entity';
import { UserService } from '../user/services/user.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateRequestWithUserRole(request: any, role: UserRole): Promise<boolean> {
    if (request.accessToken) {
      const decodedJwtAccessToken: any = this.jwtService.decode(request.accessToken);
      if (decodedJwtAccessToken.email) {
        const validUser = await this.userService.getUserByEmail(decodedJwtAccessToken.email);
        if (validUser && validUser.userRole == role) {
          return true
        }
      }
    }
    throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
  }
}
