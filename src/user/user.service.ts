import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/shared/auth/auth.service';
import { comparePassword, hashPassword } from 'src/shared/utils/userUtils';
import { SigninRequestDto } from './dtos/request/sign-request.dto';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserRepository } from './user.repository';
import { daysFromNow, isExpired, uuid } from 'src/shared/utils/common.utils';
import { TokenRequestDto } from './dtos/request/token-request.dto';
import { IRefreshToken, UserDocument } from './schema/user.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async generateJwtRefreshToken(userId: ObjectId) {
    const token = uuid();
    const refreshToken: IRefreshToken = {
      token,
      validTill: daysFromNow(2),
    };
    await this.userRepository.findByIdAndUpdate(userId, {
      refreshToken,
    });
    return token;
  }

  async signup(signUpAttrs: SignupRequestDto): Promise<UserDocument> {
    const existing = await this.userRepository.findByEmail(signUpAttrs.email);
    if (existing) {
      throw new BadRequestException('User with the email already exists');
    }
    const hashedPassword = await hashPassword(signUpAttrs.password);
    return this.userRepository.create({
      ...signUpAttrs,
      password: hashedPassword,
    });
  }

  async signin(
    signInAttrs: SigninRequestDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(signInAttrs.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const success = await comparePassword(signInAttrs.password, user.password);
    if (!success) {
      throw new BadRequestException('Invalid Password');
    }

    const jwtToken = await this.authService.signPayload({ email: user.email });
    const refreshToken = await this.generateJwtRefreshToken(user._id);
    return { token: jwtToken, refreshToken };
  }

  async reissueAuthToken(
    refreshTokenAttrs: TokenRequestDto,
  ): Promise<TokenRequestDto> {
    const { token, refreshToken } = refreshTokenAttrs;

    if (!(token && refreshToken)) {
      throw new UnauthorizedException();
    }

    const payload = await this.authService.validateJwtToken(token);
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findByEmail(payload.email);
    if (user.refreshToken.token !== refreshToken) {
      throw new BadRequestException();
    }
    if (isExpired(user.refreshToken.validTill)) {
      throw new BadRequestException();
    }

    return {
      token: await this.authService.signPayload({ email: user.email }),
      refreshToken: await this.generateJwtRefreshToken(user._id),
    };
  }
}
