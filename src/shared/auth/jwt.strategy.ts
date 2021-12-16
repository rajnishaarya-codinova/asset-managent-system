import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigurationService } from '../config/config.service';
import { ConfigEnum } from '../enum/config.enum';
import { AuthService } from './auth.service';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configurationService.get(ConfigEnum.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload, done: VerifiedCallback) {
    const user = await this.authService.validatePayload(payload);
    return done(null, user, payload.iat);
  }
}
