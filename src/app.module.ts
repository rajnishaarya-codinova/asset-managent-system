import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

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
  ],
})
export class AppModule {}
