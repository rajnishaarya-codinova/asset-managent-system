import {
  IsCurrency,
  IsDate,
  IsEnum,
  IsString,
  ValidateIf,
} from 'class-validator';
import { assetConditionEnum, assetTypeEnum } from 'src/shared/enum/asset.enum';

export class CreateAssetRequestDto {
  @IsString()
  sId: string;

  @IsString()
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
  type: string;

  @ValidateIf((reqAttrs) => !!reqAttrs.condition)
  @IsEnum(assetConditionEnum)
  condition?: string;
}
