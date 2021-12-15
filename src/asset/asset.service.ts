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
import * as xlsx from 'xlsx';
import * as QRCode from 'qrcode';

const validFormats = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly employeeService: EmployeeService,
  ) {}

  async generateQrCode(document: AssetDocument) {
    const jsonDoc = document.toJSON();
    delete jsonDoc.__v;
    delete jsonDoc._id;
    delete jsonDoc.allotedTo;
    delete jsonDoc.allocatedOn;
    delete jsonDoc.ownedBy;
    delete jsonDoc.qrCode;
    document.qrCode = await QRCode.toDataURL(JSON.stringify(jsonDoc));
    document.save();
  }

  validateFile(data: CreateAssetRequestDto) {
    if (
      typeof data.sId === undefined ||
      typeof data.sId !== 'string' ||
      data.sId.trim().length < 1
    ) {
      throw new BadRequestException();
    } else if (
      typeof data.name === undefined ||
      typeof data.name !== 'string' ||
      data.name.trim().length < 1
    ) {
      throw new BadRequestException();
    } else if (
      ![
        assetTypeEnum.DESKTOP,
        assetTypeEnum.LAPTOP,
        assetTypeEnum.MOBILE,
        assetTypeEnum.OTHER,
      ].includes(data.type)
    ) {
      throw new BadRequestException();
    }
    return data;
  }

  async createAsset(
    createAssetAttrs: CreateAssetRequestDto,
    user: UserDocument,
  ): Promise<AssetDocument> {
    const createdAsset = await this.assetRepository.create({
      ...createAssetAttrs,
      ownedBy: user._id,
    });
    await this.generateQrCode(createdAsset);
    return createdAsset;
  }

  async getAsset(assetId: string, user: UserDocument): Promise<AssetDocument> {
    if (!isValidId(assetId)) {
      throw new BadRequestException();
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
    const updatedAsset = await this.assetRepository.findByIdAndUpdate(
      asset._id,
      updateAssetAttrs,
    );

    await this.generateQrCode(updatedAsset);
    return updatedAsset;
  }

  async uploadFile(file, user) {
    try {
      if (!validFormats.includes(file.mimetype)) {
        throw new BadRequestException();
      }
      const wb = xlsx.read(file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(ws);
      const records = data.map((i: CreateAssetRequestDto) =>
        this.validateFile(i),
      );
      records.map((asset) => {
        this.createAsset(asset, user);
      });
      return true;
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }
}
