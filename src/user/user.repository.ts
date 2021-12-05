import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { UserResponseDto } from './dtos/response/user-response.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModal: Model<User>) {}

  async createUser(data: SignupRequestDto): Promise<UserResponseDto> {
    const user = await this.userModal.create(data);
    return user.toJSON();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModal.findOne({ email });
    if (!user) {
      return;
    }
    return user.toJSON();
  }
}
