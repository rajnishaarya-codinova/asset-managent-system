import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';

@Injectable()
export class ConfigurationService {
  static dbUrl: string;
  constructor(private readonly configurationService: ConfigService) {
    ConfigurationService.dbUrl = this.configurationService.get(
      ConfigEnum.MONGO_URI,
    );
  }

  get(name: ConfigEnum): string {
    return this.configurationService.get(name);
  }
}
