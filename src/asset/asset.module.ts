import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from 'src/employee/employee.module';
import { AssetController } from './asset.controller';
import { AssetRepository } from './asset.repository';
import { AssetService } from './asset.service';
import { Asset, AssetSchema } from './schema/asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    EmployeeModule,
  ],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetService, AssetRepository],
})
export class AssetModule {}
