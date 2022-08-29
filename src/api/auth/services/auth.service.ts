import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public decodeTokenToObject = (
    token: string,
  ): string | Record<string, any> => {
    return this.jwtService.decode(token);
  };

  public decodeTokenToEmail = (token: string): string => {
    const secretObject = this.decodeTokenToObject(token);
    if (typeof secretObject == 'string') {
      return secretObject;
    } else return secretObject[process.env.EMAIL_FIELD_NAME];
  };

  public fromTokenGetEmail = (
    token: string | Record<string, any>,
  ): string | null => {
    return token[process.env.EMAIL_FIELD_NAME] || null;
  };
}
