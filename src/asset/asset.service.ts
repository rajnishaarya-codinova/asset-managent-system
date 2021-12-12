import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeService } from 'src/employee/employee.service';
import { assetStatusEnum } from 'src/shared/enum/asset.enum';
import { isValidId } from 'src/shared/utils/common.utils';
import { UserDocument } from 'src/user/schema/user.schema';
import { AssetRepository } from './asset.repository';
import { CreateAssetRequestDto } from './dtos/create-asset-request.dto';
import { AssetDocument } from './schema/asset.schema';

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly employeeService: EmployeeService,
  ) {}

  async createAsset(
    createAssetAttrs: CreateAssetRequestDto,
    user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetRepository.create({
      ...createAssetAttrs,
      ownedBy: user._id,
    });
  }

  async getAsset(assetId: string, user: UserDocument): Promise<AssetDocument> {
    if (!isValidId(assetId)) {
      throw new BadRequestException();
    }
    return this.assetRepository.findOne({ _id: assetId, ownedBy: user._id });
  }

  async getAllAssets(user: UserDocument): Promise<AssetDocument[]> {
    return this.assetRepository.find({ ownedBy: user._id });
  }

  async allotAsset(
    assetId: string,
    employeeId: string,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const employee = await this.employeeService.getEmployee(employeeId, user);
    if (!employee) {
      throw new BadRequestException();
    }
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException();
    }
    asset.allotedTo = employeeId;
    asset.allocatedOn = new Date();
    asset.status = assetStatusEnum.ALLOTED;
    return this.assetRepository.findByIdAndUpdate(asset._id, asset);
  }

  async unAllocateAsset(
    assetId: string,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException();
    }
    const assetInstance = await this.assetRepository.findById(asset._id);
    assetInstance.status = assetStatusEnum.UN_ALLOTED;
    assetInstance.allotedTo = undefined;
    assetInstance.allocatedOn = undefined;
    assetInstance.save();
    return assetInstance;
  }

  async getUnAllocatedAssets(user: UserDocument): Promise<AssetDocument[]> {
    return this.assetRepository.find({
      ownedBy: user._id,
      status: assetStatusEnum.UN_ALLOTED,
    });
  }

  async getAllocatedAssets(user: UserDocument): Promise<AssetDocument[]> {
    return this.assetRepository.find({
      ownedBy: user._id,
      status: assetStatusEnum.ALLOTED,
    });
  }

  async deleteAsset(assetId: string, user: UserDocument): Promise<boolean> {
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException();
    }
    return this.assetRepository.deleteOne({ _id: asset._id });
  }

  async updateAsset(
    assetId: string,
    updateAssetAttrs: Partial<CreateAssetRequestDto>,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException();
    }
    return this.assetRepository.findByIdAndUpdate(asset._id, updateAssetAttrs);
  }
}
