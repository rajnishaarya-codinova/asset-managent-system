import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, RefType, Schema as mongoSchema } from 'mongoose';

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
      coutry: String,
      zipCode: Number,
    }),
  )
  address?: IAddress;

  @Prop({ type: mongoSchema.Types.ObjectId, ref: 'User' })
  manager: RefType;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
