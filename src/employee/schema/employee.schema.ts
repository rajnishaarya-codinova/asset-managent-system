import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, RefType, Schema as mongoSchema } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type EmployeeDocument = Employee & Document;

export interface IAddress {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: number;
}

@Schema()
export class Employee {
  @Prop({ required: true })
  empId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop(
    raw({
      city: String,
      state: String,
      country: String,
      zipCode: Number,
    }),
  )
  address?: IAddress;

  @Prop({ type: mongoSchema.Types.ObjectId, ref: User.name })
  managedBy: RefType;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
