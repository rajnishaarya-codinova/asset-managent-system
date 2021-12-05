import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { RefreshTokenRequestDto } from './dtos/request/refreshToken-request.dto';
import { SigninRequestDto } from './dtos/request/sign-request.dto';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserResponseDto } from './dtos/response/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserResponseDto)
  @Post('/signup')
  signup(@Body() body: SignupRequestDto): Promise<UserResponseDto> {
    return this.userService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninRequestDto) {
    return this.userService.signin(body);
  }

  @Post('/jwt/refresh')
  refreshJwtToken(@Body() body: RefreshTokenRequestDto) {
    return this.userService.reissueAuthToken(body);
  }
}
