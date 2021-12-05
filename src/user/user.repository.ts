import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { SignupRequestDto } from './dtos/request/signup-request.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModal: Model<User>) {}

  async createUser(data: SignupRequestDto): Promise<UserDocument> {
    const user = await this.userModal.create(data);
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModal.findOne({ email });
    if (!user) {
      return;
    }
    return user;
  }

  async findByIdAndUpdate(id: ObjectId, data): Promise<UserDocument> {
    return this.userModal.findByIdAndUpdate(id, data);
  }
}
