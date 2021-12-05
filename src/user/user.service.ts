import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/shared/auth/auth.service';
import { comparePassword, hashPassword } from 'src/shared/utils/userUtils';
import { SigninRequestDto } from './dtos/request/sign-request.dto';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserResponseDto } from './dtos/response/user-response.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async signup(data: SignupRequestDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('User with the email already exists');
    }
    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async signin(data: SigninRequestDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const success = await comparePassword(data.password, user.password);
    if (!success) {
      throw new BadRequestException('Invalid Password');
    }

    const jwtToken = await this.authService.signPayload({ email: user.email });
    return { token: jwtToken };
  }
}
