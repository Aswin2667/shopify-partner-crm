import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

}
