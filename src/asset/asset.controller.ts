import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schema/user.schema';
import { AssetService } from './asset.service';
import { CreateAssetRequestDto } from './dtos/create-asset-request.dto';
import { AssetDocument } from './schema/asset.schema';

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
  async getAllAssets(@GetUser() user: UserDocument): Promise<AssetDocument[]> {
    return this.assetService.getAllAssets(user);
  }

  @Put(':assetId/allocate/:employeeId')
  @UseGuards(AuthGuard('jwt'))
  async allocatAsset(
    @Param() { assetId, employeeId }: { assetId: string; employeeId: string },
    @GetUser() user: UserDocument,
  ): Promise<AssetDocument> {
    return this.assetService.allotAsset(assetId, employeeId, user);
  }

  @Put(':assetId/unallocate')
  @UseGuards(AuthGuard('jwt'))
  async unAllocatAsset(
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
}
