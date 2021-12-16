import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { EmployeeModule } from './employee/employee.module';
import { AssetModule } from './asset/asset.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './shared/config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigurationService],
      useFactory: async () => ({
        uri: ConfigurationService.dbUrl,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UserModule,
    EmployeeModule,
    AssetModule,
  ],
})
export class AppModule {}
