import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AlgoliaSearchResponse } from './models/AlgoliaSearchResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getBlogs(): Promise<AlgoliaSearchResponse> {
    return await this.appService.getBlogs();
  }
}
