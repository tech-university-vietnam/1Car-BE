import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './models/user.entity';
import { UserService } from './services/user.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, AuthModule],
  exports: [PassportModule, TypeOrmModule],
})
export class UserModule {}
