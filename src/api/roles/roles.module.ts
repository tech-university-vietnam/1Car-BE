import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
        UserModule,
        JwtModule.register({ secret: 'hard!to-guess_secret' })
    ],
  providers: [RolesService],
})
export class RolesModule {}
