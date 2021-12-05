import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface IRefreshToken {
  token: string;
  validTill: Date;
}

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  company: string;

  @Prop(
    raw({
      token: String,
      validTill: Date,
    }),
  )
  refreshToken: IRefreshToken;
}

export const UserSchema = SchemaFactory.createForClass(User);
