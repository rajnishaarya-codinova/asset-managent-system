import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Global()
@Module({
  exports: [AuthService],
  imports: [PassportModule, JwtModule.register({}), UserModule],
  providers: [AuthService, JwtStrategy],
})
export class SharedModule {}
