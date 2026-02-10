import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  constructor(private readonly configService: ConfigService) {}

  getProjectList() {
    return {
      process: `App name: ${process.env.APP_NAME}`,
      config: `App name: ${this.configService.get('APP_NAME')}`,
    };
  }
}
