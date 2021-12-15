import {
  IsCurrency,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { assetConditionEnum, assetTypeEnum } from 'src/shared/enum/asset.enum';

export class CreateAssetRequestDto {
  @IsString()
  @IsNotEmpty()
  sId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  brand?: string;

  @ValidateIf((reqAttrs) => !!reqAttrs.purchasedOn)
  @IsDate()
  purchasedOn?: Date;

  @ValidateIf((reqAttrs) => !!reqAttrs.price)
  @IsCurrency()
  price?: number;

  @IsEnum(assetTypeEnum)
  @IsNotEmpty()
  type: assetTypeEnum;

  @ValidateIf((reqAttrs) => !!reqAttrs.condition)
  @IsEnum(assetConditionEnum)
  condition?: string;
}
