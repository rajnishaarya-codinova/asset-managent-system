import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigurationService } from '../config/config.service';
import { ConfigEnum } from '../enum/config.enum';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configurationService: ConfigurationService) {
    cloudinary.config({
      cloud_name: this.configurationService.get(ConfigEnum.CLOUDINARY_NAME),
      api_key: this.configurationService.get(ConfigEnum.CLOUDINARY_API_KEY),
      api_secret: this.configurationService.get(
        ConfigEnum.CLOUDINARY_API_SECRET,
      ),
    });
  }
  async uploadToCloudinary(image: string): Promise<string> {
    const response = await cloudinary.uploader.upload(image, {
      upload_preset: this.configurationService.get(
        ConfigEnum.CLOUDINARY_PRESET,
      ),
    });
    return response.secure_url || response.url;
  }
}
