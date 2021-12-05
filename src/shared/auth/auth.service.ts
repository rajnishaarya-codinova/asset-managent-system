import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { UserRepository } from 'src/user/user.repository';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly jwtOptions: JwtSignOptions;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {
    this.jwtOptions = {
      expiresIn: 3600,
      secret: 'secret',
    };
  }

  signPayload(payload: IJwtPayload) {
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  async validatePayload(payload: IJwtPayload): Promise<User> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
