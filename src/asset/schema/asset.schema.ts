import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, RefType, Schema as mongoSchema } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';
import {
  assetConditionEnum,
  assetStatusEnum,
  assetTypeEnum,
} from 'src/shared/enum/asset.enum';
import { User } from 'src/user/schema/user.schema';

export type AssetDocument = Asset & Document;

@Schema()
export class Asset {
  @Prop({ required: true, unique: true })
  sId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  brand: string;

  @Prop({ required: true, enum: assetTypeEnum })
  type: string;

  @Prop()
  purchasedOn: Date;

  @Prop()
  price: number;

  @Prop({
    required: true,
    enum: assetStatusEnum,
    default: assetStatusEnum.UN_ALLOTED,
  })
  status: string;

  @Prop({ enum: assetConditionEnum })
  condition: string;

  @Prop({ required: true, type: mongoSchema.Types.ObjectId, ref: User.name })
  ownedBy: RefType;

  @Prop({ type: mongoSchema.Types.ObjectId, ref: Employee.name })
  allotedTo: RefType;

  @Prop()
  allocatedOn: Date;

  @Prop()
  qrCode: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
