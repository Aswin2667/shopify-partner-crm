import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fetch-events')
  async fetchEvents() {
    try {
      const result = await this.appService.fetchAndStoreData();
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
}
