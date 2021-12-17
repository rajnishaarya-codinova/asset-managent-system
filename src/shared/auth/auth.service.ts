import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { UserRepository } from 'src/user/user.repository';
import { ConfigurationService } from '../config/config.service';
import { ConfigEnum } from '../enum/config.enum';
import { userExceptionEnum } from '../enum/user-exception.enum';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly jwtOptions: JwtSignOptions;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configurationService: ConfigurationService,
  ) {
    this.jwtOptions = {
      expiresIn: this.configurationService.get(ConfigEnum.JWT_EXPIRE_TIME),
      secret: this.configurationService.get(ConfigEnum.JWT_SECRET),
    };
  }

  signPayload(payload: IJwtPayload) {
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  validateJwtToken(token: string): Promise<IJwtPayload> {
    return this.jwtService.verify(token, {
      secret: this.configurationService.get(ConfigEnum.JWT_SECRET),
      ignoreExpiration: true,
    });
  }

  async validatePayload(payload: IJwtPayload): Promise<User> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(userExceptionEnum.USER_UNAUTHORIZED);
    }
    return user;
  }
}
