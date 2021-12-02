import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModal: Model<User>) {}

  async signup(data) {
    const existing = await this.userModal.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('User with the email already exists');
    }
    return this.userModal.create(data);
  }
}
