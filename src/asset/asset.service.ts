import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmployeeService } from 'src/employee/employee.service';
import { assetStatusEnum, assetTypeEnum } from 'src/shared/enum/asset.enum';
import { isValidId } from 'src/shared/utils/common.utils';
import { UserDocument } from 'src/user/schema/user.schema';
import { AssetRepository } from './asset.repository';
import { CreateAssetRequestDto } from './dtos/create-asset-request.dto';
import { Asset, AssetDocument } from './schema/asset.schema';
import * as QRCode from 'qrcode';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ExcelUploadService } from 'src/shared/ExcelUpload/excel-upload.service';
import { AssetExceptionEnum } from 'src/shared/enum/asset-exception';
import { EmployeeExceptionEnum } from 'src/shared/enum/employee-exception.enum';
import { commonExceptionEnum } from 'src/shared/enum/common-exception.enum';

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly employeeService: EmployeeService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly excelUploadService: ExcelUploadService,
  ) {}

  async generateQrCode(document: AssetDocument) {
    const jsonDoc = document.toJSON();
    delete jsonDoc.__v;
    delete jsonDoc._id;
    delete jsonDoc.allotedTo;
    delete jsonDoc.allocatedOn;
    delete jsonDoc.ownedBy;
    delete jsonDoc.qrCode;
    const qrImage = await QRCode.toDataURL(JSON.stringify(jsonDoc));
    const qrUrl = await this.cloudinaryService.uploadToCloudinary(qrImage);
    document.qrCode = qrUrl;
    document.save();
  }

  validateFile(data: CreateAssetRequestDto): void {
    if (
      typeof data.sId === undefined ||
      typeof data.sId !== 'string' ||
      data.sId.trim().length < 1
    ) {
      throw new BadRequestException(AssetExceptionEnum.ASSET_SID_REQUIRED);
    } else if (
      typeof data.name === undefined ||
      typeof data.name !== 'string' ||
      data.name.trim().length < 1
    ) {
      throw new BadRequestException(AssetExceptionEnum.ASSET_NAME_REQUIRED);
    } else if (
      ![
        assetTypeEnum.DESKTOP,
        assetTypeEnum.LAPTOP,
        assetTypeEnum.MOBILE,
        assetTypeEnum.OTHER,
      ].includes(data.type)
    ) {
      throw new BadRequestException(AssetExceptionEnum.INVALID_ASSET_TYPE);
    }
  }

  async createAsset(
    createAssetAttrs: CreateAssetRequestDto,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const asset = await this.assetRepository.findOne({ sId: createAssetAttrs.sId });
    if(asset){
      throw new BadRequestException(AssetExceptionEnum.ASSET_ALREADY_EXIST)
    }
    const createdAsset = await this.assetRepository.create({
      ...createAssetAttrs,
      ownedBy: user._id,
    });
    await this.generateQrCode(createdAsset);
    return createdAsset;
  }

  async getAsset(assetId: string, user: UserDocument): Promise<AssetDocument> {
    if (!isValidId(assetId)) {
      throw new BadRequestException(AssetExceptionEnum.INVALID_ASSET_ID);
    }
    return this.assetRepository.findOne({ _id: assetId, ownedBy: user._id });
  }

  async getAllAssets(
    user: UserDocument,
    query: Partial<Asset>,
  ): Promise<AssetDocument[]> {
    return this.assetRepository.find({ ownedBy: user._id, ...query });
  }

  async allotAsset(
    assetId: string,
    employeeId: string,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const employee = await this.employeeService.getEmployee(employeeId, user);
    if (!employee) {
      throw new BadRequestException(EmployeeExceptionEnum.EMPLOYEE_NOT_FOUND);
    }
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException(AssetExceptionEnum.ASSET_NOT_FOUND);
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
      throw new BadRequestException(AssetExceptionEnum.ASSET_NOT_FOUND);
    }
    const assetInstance = await this.assetRepository.findById(asset._id);
    assetInstance.status = assetStatusEnum.UN_ALLOTED;
    assetInstance.allotedTo = undefined;
    assetInstance.allocatedOn = undefined;
    assetInstance.save();
    return assetInstance;
  }

  async deleteAsset(assetId: string, user: UserDocument): Promise<boolean> {
    const asset = await this.getAsset(assetId, user);
    if (!asset) {
      throw new BadRequestException(AssetExceptionEnum.ASSET_NOT_FOUND);
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
      throw new BadRequestException(AssetExceptionEnum.ASSET_NOT_FOUND);
    }
    const updatedAsset = await this.assetRepository.findByIdAndUpdate(
      asset._id,
      updateAssetAttrs,
    );

    await this.generateQrCode(updatedAsset);
    return updatedAsset;
  }

  async uploadFile(file: any, user: UserDocument): Promise<AssetDocument[]> {
    try {
      const data = this.excelUploadService.getData(file);
      const records = data.map((i: CreateAssetRequestDto) => {
        this.validateFile(i);
        return { ...i, ownedBy: user._id };
      });
      const uploaded = await this.assetRepository.bulkInsert(records);
      uploaded.map((item) => {
        this.generateQrCode(item);
      });
      return uploaded;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(AssetExceptionEnum.ASSET_ALREADY_EXIST);
      }
      throw new InternalServerErrorException(commonExceptionEnum.SOMETHING_WENT_WRONG);
    }
  }
}
