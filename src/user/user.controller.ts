import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserResponseDto } from './dtos/response/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserResponseDto)
  @Post('/signup')
  signup(@Body() body: SignupRequestDto) {
    return this.userService.signup(body);
  }
}
