import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ConfigurationService } from './config/config.service';

@Global()
@Module({
  exports: [AuthService, CloudinaryService, ConfigurationService],
  imports: [PassportModule, JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    JwtStrategy,
    CloudinaryService,
    ConfigurationService,
  ],
})
export class SharedModule {}
