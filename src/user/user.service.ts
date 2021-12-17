import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/shared/auth/auth.service';
import { comparePassword, hashPassword } from 'src/shared/utils/userUtils';
import { SignInRequestDto } from './dtos/request/sign-request.dto';
import { SignUpRequestDto } from './dtos/request/signup-request.dto';
import { UserRepository } from './user.repository';
import { daysFromNow, isExpired, uuid } from 'src/shared/utils/common.utils';
import { TokenRequestDto } from './dtos/request/token-request.dto';
import { IRefreshToken, UserDocument } from './schema/user.schema';
import { ObjectId } from 'mongoose';
import { userExceptionEnum } from 'src/shared/enum/user-exception.enum';

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

  async signUp(signUpAttrs: SignUpRequestDto): Promise<UserDocument> {
    const existing = await this.userRepository.findByEmail(signUpAttrs.email);
    if (existing) {
      throw new BadRequestException(userExceptionEnum.USER_ALREADY_EXIST);
    }
    const hashedPassword = await hashPassword(signUpAttrs.password);
    return this.userRepository.create({
      ...signUpAttrs,
      password: hashedPassword,
    });
  }

  async signIn(
    signInAttrs: SignInRequestDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(signInAttrs.email);
    if (!user) {
      throw new NotFoundException(userExceptionEnum.USER_NOT_FOUND);
    }
    const success = await comparePassword(signInAttrs.password, user.password);
    if (!success) {
      throw new BadRequestException(userExceptionEnum.INVALID_PASSWORD);
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
      throw new UnauthorizedException(userExceptionEnum.INVALID_TOKEN);
    }

    const payload = await this.authService.validateJwtToken(token);
    if (!payload) {
      throw new UnauthorizedException(userExceptionEnum.INVALID_TOKEN);
    }
    const user = await this.userRepository.findByEmail(payload.email);
    if (user.refreshToken.token !== refreshToken) {
      throw new BadRequestException(userExceptionEnum.INVALID_TOKEN);
    }
    if (isExpired(user.refreshToken.validTill)) {
      throw new BadRequestException(userExceptionEnum.TOKEN_EXPIRED);
    }

    return {
      token: await this.authService.signPayload({ email: user.email }),
      refreshToken: await this.generateJwtRefreshToken(user._id),
    };
  }
}
