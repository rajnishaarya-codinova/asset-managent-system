import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { SignUpRequestDto } from './dtos/request/signup-request.dto';
import { BaseRepository } from 'src/shared/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModal: Model<UserDocument>,
  ) {
    super(userModal);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModal.findOne({ email });
    if (!user) {
      return;
    }
    return user;
  }
}
