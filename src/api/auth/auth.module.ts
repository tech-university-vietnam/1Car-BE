import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'package-jwt' }),
    JwtModule,
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
