import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        PassportModule.register({ defaultStrategy: 'package-jwt' }),
        JwtModule,
      ],
      providers: [JwtStrategy, AuthService],
      exports: [AuthService, PassportModule],
    }).compile();
    authService = moduleRef.get(AuthService);
  });
  it('should return object from token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const user = authService.decodeTokenToObject(token);
    expect(user).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });

  it('should return email from token', () => {
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVXVDlHY1BFOU5OSHhDT01JUWQtaiJ9.eyJodHRwczovL2V4YW1wbGUuY29tL2VtYWlsIjoiaHV5bmhwaHVvbmduaHUuaXRAZ21haWwuY29tIiwiaXNzIjoiaHR0cHM6Ly9kZXYtZWx3czVlMTMudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA5NDM0OTU2MzY3Mzk1MDU2MTM2IiwiYXVkIjpbImh0dHBzOi8vZGV2LWVsd3M1ZTEzLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtZWx3czVlMTMudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY2MTczMTg4MywiZXhwIjoxNjYxODE4MjgzLCJhenAiOiJzeWRRSW9adGFrSHJKOWI0ZHZmeld5Q3MyWkdXd0Z6cyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIifQ.HZ5Mj4La1UHiTshq6rTcua6YyRUzkU_ePoVFpQoyKL9qs2McjsM8Npksw2aOhppKvWONF1u04d_1sht9BgAi1-xqI78AYFF6rLWSyzNgVOgWWWq2XMlt57eCqESzDdZOwq2gyHOLoOMn51zFrubiBxAm5kU7NjFh-2ZM2KeSiit3sUpOSTlkPyt5mNlBFlBVxpxxlnwN85S3qpbXObgwmlN2Cb3s1aWEtT1tEdiJ_LBFA9BJDwRKAqJIv7KOUVen73RG5eudI34-r22H4MGpQ_NL8hynhrLjpnT-EPV8IGs7ruZ8PmZIcatjtTifZ7scZfuYb7ErxjLR9sLnD1Tp7w';
    const email = authService.decodeTokenToEmail(token);
    expect(email).toEqual('huynhphuongnhu.it@gmail.com');
  });
  it('should return email from a valid decoded token object', () => {
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVXVDlHY1BFOU5OSHhDT01JUWQtaiJ9.eyJodHRwczovL2V4YW1wbGUuY29tL2VtYWlsIjoiaHV5bmhwaHVvbmduaHUuaXRAZ21haWwuY29tIiwiaXNzIjoiaHR0cHM6Ly9kZXYtZWx3czVlMTMudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA5NDM0OTU2MzY3Mzk1MDU2MTM2IiwiYXVkIjpbImh0dHBzOi8vZGV2LWVsd3M1ZTEzLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtZWx3czVlMTMudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY2MTczMTg4MywiZXhwIjoxNjYxODE4MjgzLCJhenAiOiJzeWRRSW9adGFrSHJKOWI0ZHZmeld5Q3MyWkdXd0Z6cyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIifQ.HZ5Mj4La1UHiTshq6rTcua6YyRUzkU_ePoVFpQoyKL9qs2McjsM8Npksw2aOhppKvWONF1u04d_1sht9BgAi1-xqI78AYFF6rLWSyzNgVOgWWWq2XMlt57eCqESzDdZOwq2gyHOLoOMn51zFrubiBxAm5kU7NjFh-2ZM2KeSiit3sUpOSTlkPyt5mNlBFlBVxpxxlnwN85S3qpbXObgwmlN2Cb3s1aWEtT1tEdiJ_LBFA9BJDwRKAqJIv7KOUVen73RG5eudI34-r22H4MGpQ_NL8hynhrLjpnT-EPV8IGs7ruZ8PmZIcatjtTifZ7scZfuYb7ErxjLR9sLnD1Tp7w';
    const decodedToken = authService.decodeTokenToObject(token);
    const email = authService.fromTokenGetEmail(decodedToken);
    expect(email).toEqual('huynhphuongnhu.it@gmail.com');
  });
});
