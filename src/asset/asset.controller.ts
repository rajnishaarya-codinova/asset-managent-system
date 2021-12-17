import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schema/user.schema';
import { AssetService } from './asset.service';
import { CreateAssetRequestDto } from './dtos/create-asset-request.dto';
import { Asset, AssetDocument } from './schema/asset.schema';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAsset(
    @Body() createAssetAttrs: CreateAssetRequestDto,
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.createAsset(createAssetAttrs, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllAssets(
    @GetUser() user: UserDocument,
    @Query() query: Partial<Asset>,
  ): Promise<AssetDocument[]> {
    return this.assetService.getAllAssets(user, query);
  }

  @Put(':assetId/allocate/:employeeId')
  @UseGuards(AuthGuard('jwt'))
  async allocateAsset(
    @Param() { assetId, employeeId }: { assetId: string; employeeId: string },
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.allotAsset(assetId, employeeId, user);
  }

  @Put(':assetId/un-allocate')
  @UseGuards(AuthGuard('jwt'))
  async unAllocateAsset(
    @Param() { assetId }: { assetId: string },
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.unAllocateAsset(assetId, user);
  }

  @Put(':assetId')
  @UseGuards(AuthGuard('jwt'))
  async updateAsset(
    @Param() { assetId }: { assetId: string },
    @Body() updateAssetAttrs: Partial<CreateAssetRequestDto>,
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.updateAsset(assetId, updateAssetAttrs, user);
  }

  @Delete(':assetId')
  @UseGuards(AuthGuard('jwt'))
  async deleteAsset(
    @Param() { assetId }: { assetId: string },
    @GetUser() user: UserDocument,
  ): Promise<boolean> {
    return this.assetService.deleteAsset(assetId, user);
  }

  @Get(':assetId')
  @UseGuards(AuthGuard('jwt'))
  async getAsset(
    @Param() { assetId }: { assetId: string },
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.getAsset(assetId, user);
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument[]> {
    return this.assetService.uploadFile(file, user);
  }
}
