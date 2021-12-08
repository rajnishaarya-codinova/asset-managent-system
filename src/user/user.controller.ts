import { Body, Controller, Post } from '@nestjs/common';
import { TokenRequestDto } from './dtos/request/token-request.dto';
import { SigninRequestDto } from './dtos/request/sign-request.dto';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signup(@Body() signUpAttrs: SignupRequestDto): Promise<UserDocument> {
    return this.userService.signup(signUpAttrs);
  }

  @Post('/signin')
  signin(@Body() signInAttrs: SigninRequestDto): Promise<TokenRequestDto> {
    return this.userService.signin(signInAttrs);
  }

  @Post('/jwt/refresh')
  refreshJwtToken(
    @Body() refreshTokenAttrs: TokenRequestDto,
  ): Promise<TokenRequestDto> {
    return this.userService.reissueAuthToken(refreshTokenAttrs);
  }
}
