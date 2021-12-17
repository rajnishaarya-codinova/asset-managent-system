import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TokenRequestDto } from './dtos/request/token-request.dto';
import { SignInRequestDto } from './dtos/request/sign-request.dto';
import { SignUpRequestDto } from './dtos/request/signup-request.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserResponseDto } from './dtos/response/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserResponseDto)
  @Post('/signUp')
  signUp(@Body() signUpAttrs: SignUpRequestDto): Promise<UserDocument> {
    return this.userService.signUp(signUpAttrs);
  }

  @Post('/signIn')
  signIn(@Body() signInAttrs: SignInRequestDto): Promise<TokenRequestDto> {
    return this.userService.signIn(signInAttrs);
  }

  @Post('/jwt/refresh')
  refreshJwtToken(
    @Body() refreshTokenAttrs: TokenRequestDto,
  ): Promise<TokenRequestDto> {
    return this.userService.reissueAuthToken(refreshTokenAttrs);
  }

  @Serialize(UserResponseDto)
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: UserDocument): UserDocument {
    return user;
  }
}
