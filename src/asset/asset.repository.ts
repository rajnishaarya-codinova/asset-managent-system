import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repository/base.repository';
import { Asset, AssetDocument } from './schema/asset.schema';

@Injectable()
export class AssetRepository extends BaseRepository<AssetDocument> {
  constructor(
    @InjectModel(Asset.name)
    private readonly assetModal: Model<AssetDocument>,
  ) {
    super(assetModal);
  }
}
