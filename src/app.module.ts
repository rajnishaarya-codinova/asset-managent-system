import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { EmployeeModule } from './employee/employee.module';
import { AssetModule } from './asset/asset.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://localhost/asset-management-system',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UserModule,
    SharedModule,
    EmployeeModule,
    AssetModule,
  ],
})
export class AppModule {}
